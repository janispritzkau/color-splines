<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  fromLinearSrgb,
  fromOklch,
  linearP3ToXyz,
  linearSrgbToXyz,
  oklabToXyz,
  toLinearSrgb,
  toOklch,
  xyzToLinearP3,
  xyzToLinearSrgb,
  xyzToOklab,
  type Lab,
  type Lch,
  type Rgb,
  type Xyz,
} from "./color";
import { fromHsl } from "./color/hsl";
import { bisect, inGamut, toGamut } from "./utils";

const props = withDefaults(
  defineProps<{
    colorSpace: "srgb" | "display-p3";
    showFalloff?: boolean;
    falloffLines?: boolean;
  }>(),
  { colorSpace: "srgb" },
);

const canvas = ref<HTMLCanvasElement | null>(null);
const d = ref("");

const width = 960;
const height = 480;

watchEffect(() => {
  if (!canvas.value) return;
  canvas.value.width = width / 3;
  canvas.value.height = height / 6;

  const { colorSpace, showFalloff } = props;

  const xyzToLinearRgb = {
    srgb: xyzToLinearSrgb,
    "display-p3": xyzToLinearP3,
  }[colorSpace];

  const linearRgbToXyz = {
    srgb: linearSrgbToXyz,
    "display-p3": linearP3ToXyz,
  }[colorSpace];

  const maxChroma = { srgb: 0.33, "display-p3": 0.37 }[colorSpace];
  const tmpLab: Lab = { l: 0, a: 0, b: 0 };
  const tmpXyz: Xyz = { x: 0, y: 0, z: 0 };

  const oklchToLinearRgb = (lch: Lch, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb =>
    xyzToLinearRgb(oklabToXyz(fromOklch(lch, tmpLab), tmpXyz), out);

  const ctx = canvas.value.getContext("2d", { colorSpace })!;
  const imageData = new ImageData(ctx.canvas.width, ctx.canvas.height, { colorSpace });

  for (let i = 0; i < ctx.canvas.width * ctx.canvas.height; i++) {
    const x = i % ctx.canvas.width;
    const y = Math.floor(i / ctx.canvas.width);

    const l = 1 - y / ctx.canvas.height;
    const h = (x / ctx.canvas.width) * 360;
    const lch: Lch = { l, c: maxChroma, h };
    const rgb: Rgb = { r: 0, g: 0, b: 0 };

    bisect(0, maxChroma, 0.001, (c) => {
      lch.c = c;
      return inGamut(oklchToLinearRgb(lch, rgb));
    });

    if (showFalloff) {
      toGamut(
        { l: 0.2 + (lch.c / maxChroma) * 0.8, c: maxChroma * 0.3, h },
        linearRgbToXyz,
        xyzToLinearRgb,
        rgb,
      );
    }

    fromLinearSrgb(rgb, rgb);
    imageData.data[i * 4 + 0] = rgb.r * 255;
    imageData.data[i * 4 + 1] = rgb.g * 255;
    imageData.data[i * 4 + 2] = rgb.b * 255;
    imageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  if (!props.falloffLines) return;
  d.value = "";

  for (let h = 0; h < 360; h += 10) {
    const points: { x: number; y: number }[] = [];
    for (let l = 0.5; l < 0.999; l += 8 / height) {
      const lch = toOklch(xyzToOklab(linearRgbToXyz(fromHsl({ h, s: 1, l }))));
      points.push({
        x: (lch.h / 360) * width,
        y: (1 - lch.l) * height,
      });
    }
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (i == 0) d.value += `M ${p.x.toFixed(1)} ${height} V ${p.y.toFixed(1)}`;
      else d.value += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    d.value += "V -1";
  }

  for (let l = 2 / 36; l < 1; l += 2 / 36) {
    const points: { x: number; y: number }[] = [];
    for (let h = 0; h < 360; h += (360 / width) * 5) {
      const lch = toOklch(xyzToOklab(linearRgbToXyz(toLinearSrgb(fromHsl({ h, s: 1, l })))));
      points.push({
        x: (lch.h / 360) * width,
        y: (1 - lch.l) * height,
      });
    }
    const breakIdx = points.findIndex(
      (p, i) => Math.abs(p.x - points[(i - 1 + points.length) % points.length].x) > width / 2,
    );
    if (breakIdx == -1) continue;
    for (let i = breakIdx - 1; i <= points.length + breakIdx; i++) {
      const p = points[(i + points.length) % points.length];
      const x = i >= breakIdx ? (i < points.length + breakIdx ? p.x : p.x + width) : p.x - width;
      if (i == breakIdx - 1) d.value += `M ${x.toFixed(1)} ${p.y.toFixed(1)}`;
      else d.value += ` L ${x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
  }
});
</script>

<template>
  <div class="relative isolate">
    <canvas class="absolute -z-10 size-full" ref="canvas" />
    <svg :viewBox="`0 0 ${width} ${height}`">
      <path
        v-if="falloffLines && d"
        :d="d"
        fill="none"
        stroke="#0002"
        stroke-width="1"
        stroke-linejoin="round" />
    </svg>
  </div>
</template>
