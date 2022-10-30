import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import volumeRenderShader from "../shaders/volumeShader";
import { cmtextures } from "../textures";

type volumeProps = {
    volume: any;
};
export type objectProps = {
    clim1?: number;
    clim2?: number;
    colormap?: string;
    renderstyle?: string;
    isothreshold?: number;
    clipping?: boolean;
};
export type planesProps = {
    planes?: THREE.Plane[];
};
/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @function Object
 * @abstract Core
 * @param volume any
 * @param clim1 number, Default 0
 * @param clim2 number, Default 1
 * @param colormap string, Default viridis
 * @param renderstyle string, Default mip
 * @param isothreshold number, Default 0.1
 * @param clipping boolean, Default false
 * @param planes THREE.Plane
 */
export function Object({
    volume,
    clim1 = 0,
    clim2 = 1,
    colormap = "viridis",
    renderstyle = "mip",
    isothreshold = 0.1,
    clipping = false,
    planes = [],
    ...props
}: volumeProps & objectProps & planesProps & JSX.IntrinsicElements["mesh"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    // Mesh
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());

    // Material
    const materialRef = useRef<THREE.ShaderMaterial>(
        new THREE.ShaderMaterial()
    );

    // Geometry
    const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BoxGeometry());

    // Texture
    const cmtexturesRef = useRef<{ [index: string]: THREE.Texture }>(null!);
    const [texture, setTexture] = useState<THREE.Data3DTexture>(
        new THREE.Data3DTexture(
            volume.data,
            volume.xLength,
            volume.yLength,
            volume.zLength
        )
    );

    // Init
    useLayoutEffect(() => {
        // Texture
        cmtexturesRef.current = {
            viridis: new THREE.TextureLoader().load("/textures/cm_viridis.png"),
            gray: new THREE.TextureLoader().load("/textures/cm_gray.png"),
        };
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
        uniforms.u_cmdata.value = cmtexturesRef.current[colormap];
        console.log(cmtexturesRef.current[colormap]);
        materialRef.current.uniforms = uniforms;

        meshRef.current.updateMatrixWorld();
        const modelMatrix = meshRef.current.matrixWorld;
        uniforms.u_modelMatrix.value = modelMatrix;

        materialRef.current.side = THREE.BackSide; // The volume shader uses the backface as its "reference point"
        materialRef.current.clipping = clipping;
        if (clipping) {
            materialRef.current.clippingPlanes = planes;
        }
    }, []);

    useEffect(() => {
        // Geometry
        geometryRef.current.copy(
            new THREE.BoxGeometry(
                volume.xLength,
                volume.yLength,
                volume.zLength
            )
        );
        geometryRef.current.translate(
            volume.xLength / 2,
            volume.yLength / 2,
            volume.zLength / 2
        );
        console.log(geometryRef.current);

        // Material
        materialRef.current.uniforms.u_data.value = texture;
        materialRef.current.uniforms.u_size.value.set(
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
    }, [volume]);

    // Update
    useFrame(() => {
        materialRef.current.uniforms.u_clim.value.set(clim1, clim2);
        materialRef.current.uniforms.u_renderstyle.value =
            renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
        materialRef.current.uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        materialRef.current.uniforms.u_cmdata.value =
            cmtexturesRef.current[colormap];
        if (clipping) {
            materialRef.current.clippingPlanes = planes;
        }
    });

    return (
        <>
            <mesh {...props} ref={meshRef}>
                <bufferGeometry ref={geometryRef} />
                <shaderMaterial ref={materialRef} />
            </mesh>
        </>
    );
}
