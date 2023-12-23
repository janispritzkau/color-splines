import type { Rgb, Xyz } from "./types";

const tmpRgb: Rgb = { r: 0, g: 0, b: 0 };

export function srgbToXyz(rgb: Rgb, out: Xyz = { x: 0, y: 0, z: 0 }): Xyz {
  return linearSrgbToXyz(toLinearSrgb(rgb, tmpRgb), out);
}

export function xyzToSrgb(xyz: Xyz, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  return fromLinearSrgb(xyzToLinearSrgb(xyz, tmpRgb), out);
}

export function linearSrgbToXyz({ r, g, b }: Rgb, out: Xyz = { x: 0, y: 0, z: 0 }): Xyz {
  out.x = (506752 / 1228815) * r + (87881 / 245763) * g + (12673 / 70218) * b;
  out.y = (87098 / 409605) * r + (175762 / 245763) * g + (12673 / 175545) * b;
  out.z = (7918 / 409605) * r + (87881 / 737289) * g + (1001167 / 1053270) * b;
  return out;
}

export function xyzToLinearSrgb({ x, y, z }: Xyz, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  out.r = (12831 / 3959) * x - (329 / 214) * y - (1974 / 3959) * z;
  out.g = (-851781 / 878810) * x + (1648619 / 878810) * y + (36519 / 878810) * z;
  out.b = (705 / 12673) * x - (2585 / 12673) * y + (705 / 667) * z;
  return out;
}

export function fromLinearSrgb({ r, g, b }: Rgb, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  out.r = r <= 0.0031308 ? 12.92 * r : 1.055 * r ** (1 / 2.4) - 0.055;
  out.g = g <= 0.0031308 ? 12.92 * g : 1.055 * g ** (1 / 2.4) - 0.055;
  out.b = b <= 0.0031308 ? 12.92 * b : 1.055 * b ** (1 / 2.4) - 0.055;
  return out;
}

export function toLinearSrgb({ r, g, b }: Rgb, out: Rgb = { r: 0, g: 0, b: 0 }): Rgb {
  out.r = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  out.g = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  out.b = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
  return out;
}
