# coding: utf-8

"""
yuki-koyama/tinycolormap
@link https://github.com/yuki-koyama/tinycolormap

tinycolormap.hpp
@link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L199
"""

import numpy as np
import cv2

import colormap

def GetColor(x, type):
    color = np.array([0, 0, 0])

    if (type == "parula"):
        color = colormap.parula.GetParulaColor(x)
    elif (type == "heat"):
        color = colormap.heat.GetHeatColor(x)
    elif (type == "jet"):
        color = colormap.jet.GetJetColor(x)
    elif (type == "turbo"):
        color = colormap.turbo.GetTurboColor(x)
    elif (type == "hot"):
        color = colormap.hot.GetHotColor(x)
    elif (type == "gray"):
        color = colormap.gray.GetGrayColor(x)
    elif (type == "magma"):
        color = colormap.magma.GetMagmaColor(x)
    elif (type == "inferno"):
        color = colormap.inferno.GetInfernoColor(x)
    elif (type == "plasma"):
        color = colormap.plasma.GetPlasmaColor(x)
    elif (type == "viridis"):
        color = colormap.viridis.GetViridisColor(x)
    elif (type == "cividis"):
        color = colormap.cividis.GetCividisColor(x)
    elif (type == "github"):
        color = colormap.githubColor.GetGithubColor(x)
    elif (type == "cubehelix"):
        color = colormap.cubeHelix.GetCubehelixColor(x)
    else:
        color = np.array([0xff, 0x55, 0xdd])
        color = color / 0xff

    return color

"""
@param width
@param height
@param type parula, heat, jet, turbo, hot, gray, magma, inferno, plasma, viridis, cividis, github, cubehelix
@returns
"""
def GetTexture(width, height, type, filename="colormap.png"):
    # data = np.zeros((height, width, 4), np.uint8)
    data = np.zeros((height, width, 3), np.uint8)

    for i in range(0, height):
        for j in range(0, width):
            color = GetColor(j / (width - 1), type)
            color = color * 255
            # color = np.append(color, 1)
            data[i][j] = color

    cv2.imwrite(filename, data)


# TODO: python colormapTextures.py
if __name__ == "__main__":
    width = 256
    height = 1
    colormap_type = ["parula", "heat", "jet", "turbo", "hot", "gray", "magma", "inferno", "plasma", "viridis", "cividis", "github", "cubehelix"]
    # colormap_type = ["default"]
    for c in colormap_type:
        GetTexture(width, height, c, "./../img/cm_" + c + ".png")