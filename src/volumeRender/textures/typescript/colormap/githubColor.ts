/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L2158
 */

import { CalcLerp } from "../utils";

export function GetGithubColor(x: number)
{
    const data =
    [
        [0.933333, 0.933333, 0.933333] ,
        [0.776470, 0.894117, 0.545098] ,
        [0.482352, 0.788235, 0.435294] ,
        [0.137254, 0.603921, 0.231372] ,
        [0.098039, 0.380392, 0.152941]
    ];

    return CalcLerp(x, data);
}
