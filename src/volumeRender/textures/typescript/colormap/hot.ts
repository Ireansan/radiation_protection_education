/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L803
 */

import * as THREE from "three";

import { Clamp01 } from "../utils";

export function GetHotColor(x: number)
{
    x = Clamp01(x);

    const r = new THREE.Vector3( 1.0, 0.0, 0.0 );
    const g = new THREE.Vector3( 0.0, 1.0, 0.0 );
    const b = new THREE.Vector3( 0.0, 0.0, 1.0 );

    if (x < 0.4)
    {
        const t: number = x / 0.4;
        // t * r
        const c = r.multiplyScalar(t);
        return new THREE.Color(c.x, c.y, c.z);
    }
    else if (x < 0.8)
    {
        const t: number = (x - 0.4) / (0.8 - 0.4);
        g.multiplyScalar(t);
        const c = new THREE.Vector3().addVectors(r, g);
        // r + (t * g)
        return new THREE.Color(c.x, c.y, c.z);;
    }
    else
    {
        const t: number = (x - 0.8) / (1.0 - 0.8);
        b.multiplyScalar(t);
        const c = new THREE.Vector3().addVectors(r, g).add(b);
        // r + g + (t * b)
        return new THREE.Color(c.x, c.y, c.z);
    }
}