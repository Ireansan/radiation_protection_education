"""
yuki-koyama/tinycolormap
@link https://github.com/yuki-koyama/tinycolormap

tinycolormap.hpp
@link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L502
"""

from . import Utils

def GetJetColor(x):
    data = [
        [ 0.0, 0.0, 0.5 ],
        [ 0.0, 0.0, 1.0 ],
        [ 0.0, 0.5, 1.0 ],
        [ 0.0, 1.0, 1.0 ],
        [ 0.5, 1.0, 0.5 ],
        [ 1.0, 1.0, 0.0 ],
        [ 1.0, 0.5, 0.0 ],
        [ 1.0, 0.0, 0.0 ],
        [ 0.5, 0.0, 0.0 ]
    ]

    return Utils.CalcLerp(x, data)