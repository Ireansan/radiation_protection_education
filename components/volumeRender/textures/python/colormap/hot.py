import numpy as np

"""
yuki-koyama/tinycolormap
@link https://github.com/yuki-koyama/tinycolormap

tinycolormap.hpp
@link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L
"""

from . import Utils

def GetHotColor(x):
    x = Utils.Clamp01(x)

    r = np.array( [1.0, 0.0, 0.0] )
    g = np.array( [0.0, 1.0, 0.0] )
    b = np.array( [0.0, 0.0, 1.0] )

    if (x < 0.4):
        t = x / 0.4
        c = t * r
        return c
    elif (x < 0.8):
        t = (x - 0.4) / (0.8 - 0.4)
        c = r + (t * g)
        return c
    else:
        t = (x - 0.8) / (1.0 - 0.8)
        c = r + g + (t * b)
        return c