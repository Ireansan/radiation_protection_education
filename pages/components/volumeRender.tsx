/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React, { useRef, useLayoutEffect } from "react";

import { useLoader, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "../jsm/loaders/NRRDLoader";
import { volumeRenderShader } from "../shaders/volumeShader";
import {
    volumeRenderStates,
    clippingPlaneStore,
} from "../states/nrrd_view.states";

type volumeArgs = {
    volume: any;
    cmtextures: THREE.Texture[];
    clim1: number;
    clim2: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
    plane: THREE.Plane;
};
function VolumeRenderObject({
    volume,
    cmtextures,
    clim1,
    clim2,
    colormap,
    renderstyle,
    isothreshold,
    plane,
}: volumeArgs) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    // Material
    const materialRef = useRef<THREE.ShaderMaterial>(
        new THREE.ShaderMaterial()
    );

    // Geometry
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

    useLayoutEffect(() => {
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
        materialRef.current.vertexShader = shader.vertexShader;
        materialRef.current.fragmentShader = shader.fragmentShader;

        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        uniforms.u_data.value = texture;
        uniforms.u_size.value.set(
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
        uniforms.u_clim.value.set(clim1, clim2);
        uniforms.u_renderstyle.value = renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        uniforms.u_cmdata.value = cmtextures[colormap];
        materialRef.current.uniforms = uniforms;

        materialRef.current.side = THREE.BackSide; // The volume shader uses the backface as its "reference point"
        materialRef.current.clipping = true;
        materialRef.current.clippingPlanes = [plane];
    }, []);

    useFrame(() => {
        materialRef.current.uniforms.u_clim.value.set(clim1, clim2);
        materialRef.current.uniforms.u_renderstyle.value =
            renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
        materialRef.current.uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        materialRef.current.uniforms.u_cmdata.value = cmtextures[colormap];
        materialRef.current.clippingPlanes = [plane];
    });

    return (
        <>
            <mesh geometry={geometry}>
                <shaderMaterial ref={materialRef} />
            </mesh>
        </>
    );
}

type volumeRenderArg = {
    filepath: string;
};
function VolumeRender({ filepath }: volumeRenderArg) {
    const { clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volumeRenderStates);
    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

    // Load nrrd
    const volume: any = useLoader(NRRDLoader, filepath);

    // Colormap textures
    const cmtextures = [
        new THREE.TextureLoader().load("textures/cm_viridis.png"),
        new THREE.TextureLoader().load("textures/cm_gray.png"),
    ];

    return (
        <>
            <VolumeRenderObject
                volume={volume}
                cmtextures={cmtextures}
                clim1={clim1}
                clim2={clim2}
                colormap={colormap}
                renderstyle={renderstyle}
                isothreshold={isothreshold}
                plane={plane}
            />
        </>
    );
}

export { VolumeRender };
