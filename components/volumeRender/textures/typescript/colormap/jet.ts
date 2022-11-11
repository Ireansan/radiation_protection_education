/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L502
 */

import { CalcLerp } from "../utils";

export function GetJetColor(x: number)
{
    const data =
    [
        [ 0.0, 0.0, 0.5 ],
        [ 0.0, 0.0, 1.0 ],
        [ 0.0, 0.5, 1.0 ],
        [ 0.0, 1.0, 1.0 ],
        [ 0.5, 1.0, 0.5 ],
        [ 1.0, 1.0, 0.0 ],
        [ 1.0, 0.5, 0.0 ],
        [ 1.0, 0.0, 0.0 ],
        [ 0.5, 0.0, 0.0 ]
    ];

    return CalcLerp(x, data);
}