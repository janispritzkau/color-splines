import type { Hsv, Rgb } from ".";

export function fromHsv(hsv: Hsv): Rgb {
  const f = (n: number) => {
    const k = (n + hsv.h / 60) % 6;
    return hsv.v - hsv.v * hsv.s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return { r: f(5), g: f(3), b: f(1) };
}

export function toHsv(rgb: Rgb): Hsv {
  const v = Math.max(rgb.r, rgb.g, rgb.b);
  const d = v - Math.min(rgb.r, rgb.g, rgb.b);
  const s = v == 0 ? 0 : d / v;
  const h =
    v == rgb.r
      ? (rgb.g - rgb.b) / d
      : v == rgb.g
        ? 2 + (rgb.b - rgb.r) / d
        : 4 + (rgb.r - rgb.g) / d;
  return { h: h * 60, s, v };
}
