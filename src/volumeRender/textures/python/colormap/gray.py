import numpy as np

"""
yuki-koyama/tinycolormap
@link https://github.com/yuki-koyama/tinycolormap

tinycolormap.hpp
@link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L828
"""

from . import Utils

def GetGrayColor(x):
    return np.array([1.0 - Utils.Clamp01(x), 1.0 - Utils.Clamp01(x), 1.0 - Utils.Clamp01(x)])