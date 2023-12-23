import { fromOklch, oklabToXyz, xyzToOklab, type Lab, type Lch, type Rgb, type Xyz } from "./color";

export function bisect(min: number, max: number, eps: number, f: (x: number) => boolean): number {
  while (max - min > eps) {
    const mid = (min + max) / 2;
    if (f(mid)) {
      min = mid;
    } else {
      max = mid;
    }
  }
  return (min + max) / 2;
}

export function smoothstep(x: number): number {
  return x * x * (3 - 2 * x);
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

export function clampRgb(rgb: Rgb, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  out.r = clamp(rgb.r, 0, 1);
  out.g = clamp(rgb.g, 0, 1);
  out.b = clamp(rgb.b, 0, 1);
  return out;
}

export function inGamut({ r, g, b }: Rgb): boolean {
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
}

const tmpLab: Lab = { l: 0, a: 0, b: 0 };
const tmpXyz: Xyz = { x: 0, y: 0, z: 0 };
const tmpClampedLab: Lab = { l: 0, a: 0, b: 0 };

export function toGamut(
  lch: Lch,
  rgbToXyz: (rgb: Rgb, out: Xyz) => Xyz,
  xyzToRgb: (xyz: Xyz, out: Rgb) => Rgb,
  out: Rgb = { r: 0, g: 0, b: 0 },
): Rgb {
  const eps = 0.001; // numerical precision
  const jnd = 0.02; // just noticeable difference
  let min = 0;
  let max = lch.c;

  while (max - min > eps) {
    lch.c = (min + max) / 2;
    xyzToRgb(oklabToXyz(fromOklch(lch, tmpLab), tmpXyz), out);
    if (inGamut(out)) {
      min = lch.c;
    } else {
      xyzToOklab(rgbToXyz(clampRgb(out), tmpXyz), tmpClampedLab);
      const e = deltaEOK(tmpLab, tmpClampedLab);
      if (e < jnd) {
        if (jnd - e < eps) break;
        min = lch.c;
      } else {
        max = lch.c;
      }
    }
  }

  return out;
}

function deltaEOK(lab1: Lab, lab2: Lab): number {
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  return Math.hypot(deltaL, deltaA, deltaB);
}
