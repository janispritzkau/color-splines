import type { Rgb, Xyz } from "./types";
import { fromLinearSrgb, toLinearSrgb } from "./srgb";

const tmpRgb: Rgb = { r: 0, g: 0, b: 0 };

export function p3ToXyz(rgb: Rgb, out: Xyz = { x: 0, y: 0, z: 0 }): Xyz {
  return linearP3ToXyz(toLinearSrgb(rgb, tmpRgb), out);
}

export function xyzToP3(xyz: Xyz, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  return fromLinearSrgb(xyzToLinearP3(xyz, tmpRgb), out);
}

export function linearP3ToXyz({ r, g, b }: Rgb, out: Xyz = { x: 0, y: 0, z: 0 }): Xyz {
  out.x = (608311 / 1250200) * r + (189793 / 714400) * g + (198249 / 1000160) * b;
  out.y = (35783 / 156275) * r + (247089 / 357200) * g + (198249 / 2500400) * b;
  out.z = (32229 / 714400) * g + (5220557 / 5000800) * b;
  return out;
}

export function xyzToLinearP3({ x, y, z }: Xyz, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  out.r = (446124 / 178915) * x - (333277 / 357830) * y - (72051 / 178915) * z;
  out.g = (-14852 / 17905) * x + (63121 / 35810) * y + (423 / 17905) * z;
  out.b = (11844 / 330415) * x - (50337 / 660830) * y + (316169 / 330415) * z;
  return out;
}

export { fromLinearSrgb as fromLinearP3, toLinearSrgb as toLinearP3 };
