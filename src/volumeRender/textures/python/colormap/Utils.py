
"""
yuki-koyama/tinycolormap
@link https://github.com/yuki-koyama/tinycolormap

tinycolormap.hpp
@link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L152
"""

import math
import numpy as np

def Clamp01(x):
    # return x < 0.0 if 0.0 else x > 1.0 if 1.0 else x
    return 0.0 if x < 0.0 else 1.0 if x > 1.0 else x

def CalcLerp(x, data):
    N = len(data)
    a = Clamp01(x) * (N - 1)
    i = math.floor(a)
    t = a - i
    c0 = np.array(data[math.trunc(i)])
    c0 = c0 * (1.0 - t)
    c1 = np.array(data[math.trunc(math.ceil(a))])
    c1 = c1 * t
    c = c0 + c1

    return c

