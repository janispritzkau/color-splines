import type { Lab, Lch, Xyz } from "./types";

export function oklabToXyz({ l, a, b }: Lab, out: Xyz = { x: 0, y: 0, z: 0 }): Xyz {
  const L =
    (0.99999999845051981432 * l + 0.39633779217376785678 * a + 0.21580375806075880339 * b) ** 3;
  const M =
    (1.0000000088817607767 * l - 0.1055613423236563494 * a - 0.063854174771705903402 * b) ** 3;
  const S =
    (1.0000000546724109177 * l - 0.089484182094965759684 * a - 1.2914855378640917399 * b) ** 3;
  out.x = 1.2268798733741557 * L - 0.5578149965554813 * M + 0.28139105017721583 * S;
  out.y = -0.04057576262431372 * L + 1.1122868293970594 * M - 0.07171106666151701 * S;
  out.z = -0.07637294974672142 * L - 0.4214933239627914 * M + 1.5869240244272418 * S;
  return out;
}

export function xyzToOklab({ x, y, z }: Xyz, out: Lab = { l: 0, a: 0, b: 0 }): Lab {
  const l = Math.cbrt(0.8190224432164319 * x + 0.3619062562801221 * y + -0.12887378261216414 * z);
  const m = Math.cbrt(0.0329836671980271 * x + 0.9292868468965546 * y + 0.03614466816999844 * z);
  const s = Math.cbrt(0.048177199566046255 * x + 0.26423952494422764 * y + 0.6335478258136937 * z);
  out.l = 0.2104542553 * l + 0.793617785 * m + -0.0040720468 * s;
  out.a = 1.9779984951 * l + -2.428592205 * m + 0.4505937099 * s;
  out.b = 0.0259040371 * l + 0.7827717662 * m + -0.808675766 * s;
  return out;
}

export function fromOklch({ l, c, h }: Lch, out: Lab = { l: 0, a: 0, b: 0 }): Lab {
  out.l = l;
  out.a = c * Math.cos((h * Math.PI) / 180);
  out.b = c * Math.sin((h * Math.PI) / 180);
  return out;
}

export function toOklch({ l, a, b }: Lab, out: Lch = { l: 0, c: 0, h: 0 }): Lch {
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  out.l = l;
  out.c = Math.hypot(a, b);
  out.h = h >= 0 ? h : h + 360;
  return out;
}
