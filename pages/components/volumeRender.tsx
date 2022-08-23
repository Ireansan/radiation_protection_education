/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React, { MutableRefObject } from "react";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "../jsm/loaders/NRRDLoader";
import { volumeRenderShader } from "../shaders/volumeShader";
import { volumeRenderStates } from "../states/nrrd_view.states";

type volumeArgs = {
    volume: any;
    clim1: number;
    clim2: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
    position: THREE.Vector3;
    up: THREE.Vector3;
};
function VolumeRenderObject({
    volume,
    clim1,
    clim2,
    colormap,
    renderstyle,
    isothreshold,
    position,
    up,
}: volumeArgs) {
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
    uniforms.u_plane_position.value.copy(position);
    uniforms.u_plane_up.value.copy(up);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.DoubleSide, // The volume shader uses the backface as its "reference point"
        // side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
        clipping: true,
        // clippingPlanes: [plane],
    });

    const geometry = new THREE.BoxGeometry(
        volume.xLength,
        volume.yLength,
        volume.zLength
    );
    geometry.translate(
        volume.xLength / 2,
        volume.yLength / 2,
        volume.zLength / 2
    );
    console.log(position, up);

    return (
        <>
            <mesh geometry={geometry} material={material} />
        </>
    );
}

function VolumeRender() {
    const {
        clim1,
        clim2,
        colormap,
        renderstyle,
        isothreshold,
        position,
        up,
        plane,
    } = useSnapshot(volumeRenderStates);

    // Load nrrd
    var filepaths = [
        "/models/nrrd/stent.nrrd",
        "/models/nrrd/dose_106_200_290.nrrd",
        "/models/nrrd/dose_d100.nrrd",
    ];
    // const volume: any = useLoader(NRRDLoader, filepaths[2]);
    const volume: any = useLoader(NRRDLoader, filepaths[0]);

    return (
        <>
            <VolumeRenderObject
                volume={volume}
                clim1={clim1}
                clim2={clim2}
                colormap={colormap}
                renderstyle={renderstyle}
                isothreshold={isothreshold}
                position={position}
                up={plane.up}
            />
        </>
    );
}

export { VolumeRender };
