/**
 * yuki-koyama/tinycolormap
 * @link https://github.com/yuki-koyama/tinycolormap
 *
 * tinycolormap.hpp
 * @link https://github.com/yuki-koyama/tinycolormap/blob/d75a66dd4ba8469eadadb953a843aa2cc4dc357c/include/tinycolormap.hpp#L199
 */

import * as THREE from "three";

import {
    GetCividisColor,
    GetCubehelixColor,
    GetGithubColor,
    GetGrayColor,
    GetHeatColor,
    GetHotColor,
    GetInfernoColor,
    GetJetColor,
    GetMagmaColor,
    GetParulaColor,
    GetPlasmaColor,
    GetTurboColor,
    GetViridisColor,
} from "./colormap";

function GetColor(x: number, type: string): THREE.Color {
    let color: THREE.Color;

    switch (type) {
        case "parula":
            color = GetParulaColor(x);
            break;
        case "heat":
            color = GetHeatColor(x);
            break;
        case "jet":
            color = GetJetColor(x);
            break;
        case "turbo":
            color = GetTurboColor(x);
            break;
        case "hot":
            color = GetHotColor(x);
            break;
        case "gray":
            color = GetGrayColor(x);
            break;
        case "magma":
            color = GetMagmaColor(x);
            break;
        case "inferno":
            color = GetInfernoColor(x);
            break;
        case "plasma":
            color = GetPlasmaColor(x);
            break;
        case "viridis":
            color = GetViridisColor(x);
            break;
        case "cividis":
            color = GetCividisColor(x);
            break;
        case "github":
            color = GetGithubColor(x);
            break;
        case "cubehelix":
            color = GetCubehelixColor(x);
            break;
        default:
            color = new THREE.Color(0xff55dd);
            break;
    }

    return color;
}

/**
 *
 * @param width
 * @param height
 * @param type parula, heat, jet, turbo, hot, gray, magma, inferno, plasma, viridis, cividis, github, cubehelix
 * @returns
 */
export function GetTexture(width: number, height: number, type: string) {
    var size = width * height;
    var data = new Uint8Array(size * 4);

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var color = GetColor(j / (width - 1), type).clone();
            var stride = (i * width + j) * 4;
            data[stride] = color.r * 255;
            data[stride + 1] = color.g * 255;
            data[stride + 2] = color.b * 255;
            data[stride + 3] = 1;
        }
    }
    const texture = new THREE.DataTexture(
        data,
        width,
        height,
        THREE.RGBAFormat,
        THREE.UnsignedByteType,
    );
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    return texture;
}

export const cmtextures: {[index: string]: THREE.DataTexture} = {
    parula: GetTexture(256, 1, "parula"),
    heat: GetTexture(256, 1, "heat"),
    jet: GetTexture(256, 1, "jet"),
    turbo: GetTexture(256, 1, "turbo"),
    hot: GetTexture(256, 1, "hot"),
    gray: GetTexture(256, 1, "gray"),
    magma: GetTexture(256, 1, "magma"),
    inferno: GetTexture(256, 1, "inferno"),
    plasma: GetTexture(256, 1, "plasma"),
    viridis: GetTexture(256, 1, "viridis"),
    cividis: GetTexture(256, 1, "cividis"),
    github: GetTexture(256, 1, "github"),
    cubehelix: GetTexture(256, 1, "cubehelix")
}
