/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L828
 */

import * as THREE from "three";

import { Clamp01 } from "../utils";

export function GetGrayColor(x: number)
{
    return new THREE.Color(1.0 - Clamp01(x), 1.0 - Clamp01(x), 1.0 - Clamp01(x));
}