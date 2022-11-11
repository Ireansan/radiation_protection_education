/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L152
 */

import * as THREE from "three";

export function Clamp01(x: number): number {
    return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;
}

export function CalcLerp(x: number, data: Array<number[]>): THREE.Color {
    const N: number = data.length;
    const a: number = Clamp01(x) * (N - 1);
    const i: number = Math.floor(a);
    const t: number = a - i;
    const c0 = new THREE.Vector3().fromArray(data[Math.trunc(i)]);
    c0.multiplyScalar(1.0 - t);
    const c1 = new THREE.Vector3().fromArray(data[Math.trunc(Math.ceil(a))]);
    c1.multiplyScalar(t);
    const c = new THREE.Vector3().addVectors(c0, c1);

    return new THREE.Color(c.x, c.y, c.z);
}

