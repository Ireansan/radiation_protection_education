/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React from "react";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { NRRDLoader } from "../jsm/loaders/NRRDLoader";
import { volumeRenderShader } from "../shaders/volumeShader";

type volumeArgs = {
    clim1: number;
    clim2: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
    position: THREE.Vector3;
    up: THREE.Vector3;
};
function VolumeRender({
    clim1,
    clim2,
    colormap,
    renderstyle,
    isothreshold,
    position,
    up,
}: volumeArgs) {
    // Load nrrd
    var filepaths = [
        "/models/nrrd/stent.nrrd",
        "/models/nrrd/dose_106_200_290.nrrd",
        "/models/nrrd/dose_d100.nrrd",
    ];
    const volume: any = useLoader(NRRDLoader, filepaths[2]);

    // Colormap textures
    const cmtextures = [
        new THREE.TextureLoader().load("textures/cm_viridis.png"),
        new THREE.TextureLoader().load("textures/cm_gray.png"),
    ];

    // Texture
    const texture = new THREE.Data3DTexture(
        volume.data,
        volume.xLength,
        volume.yLength,
        volume.zLength
    );
    texture.format = THREE.RedFormat;
    texture.type = THREE.FloatType;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    // Material
    const shader = volumeRenderShader;
    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms.u_data.value = texture;
    uniforms.u_size.value.set(volume.xLength, volume.yLength, volume.zLength);
    uniforms.u_clim.value.set(clim1, clim2);
    uniforms.u_renderstyle.value = renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
    uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
    uniforms.u_cmdata.value = cmtextures[colormap];
    uniforms.u_planeposition.copy(position);
    uniforms.u_planeup.copy(up);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
    });

    const geometry = new THREE.BoxGeometry(
        volume.xLength,
        volume.yLength,
        volume.zLength
    );
    geometry.translate(
        volume.xLength / 2 - 0.5,
        volume.yLength / 2 - 0.5,
        volume.zLength / 2 - 0.5
    );

    return (
        <>
            <mesh geometry={geometry} material={material} />
        </>
    );
}

export { VolumeRender };
