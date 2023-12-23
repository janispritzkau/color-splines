import type { Hsl, Rgb } from ".";

export function fromHsl(hsl: Hsl): Rgb {
  const f = (n: number) => {
    const k = (n + hsl.h / 30) % 12;
    const a = hsl.s * Math.min(hsl.l, 1 - hsl.l);
    return hsl.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: f(0), g: f(8), b: f(4) };
}

export function toHsl(rgb: Rgb): Hsl {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max == rgb.r
      ? (rgb.g - rgb.b) / d
      : max == rgb.g
        ? 2 + (rgb.b - rgb.r) / d
        : 4 + (rgb.r - rgb.g) / d;
  return { h: h * 60, s, l };
}
