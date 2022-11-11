import React, {
    useRef,
    useLayoutEffect,
    useState,
    useEffect,
    useMemo,
} from "react";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import volumeRenderShader from "../shaders/volumeShader";
import { cmtextures } from "../textures/typescript";

/**
 * FIXME:
 * すごい重い
 * 値の変更を行うと14-20fpsくらいまで落ちる
 */

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

    // Geometry
    const geometryRef = useRef<THREE.BufferGeometry>(
        new THREE.BufferGeometry()
    );
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
    }, [volume]);

    // Material
    const materialRef = useRef<THREE.ShaderMaterial>(
        new THREE.ShaderMaterial()
    );
    const shaderArgs = useMemo(() => {
        // Shader
        const shader = volumeRenderShader;
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

        return {
            uniforms: {
                u_data: { value: texture },
                u_size: {
                    value: new THREE.Vector3(
                        volume.xLength,
                        volume.yLength,
                        volume.zLength
                    ),
                },
                u_clim: { value: new THREE.Vector2(clim1, clim2) },
                u_renderstyle: { value: renderstyle === "mip" ? 0 : 1 }, // 0: MIP, 1: ISO
                u_renderthreshold: { value: isothreshold }, // For ISO renderstyle
                u_cmdata: { value: cmtextures[colormap] },
                u_modelMatrix: { value: meshRef.current.matrixWorld },
            },
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
            clipping: clipping,
            clippingPlanes: clipping ? planes : [],
        };
    }, [
        volume,
        clim1,
        clim2,
        renderstyle,
        isothreshold,
        colormap,
        clipping,
        planes,
    ]);

    // Update
    useFrame(() => {
        shaderArgs.uniforms.u_clim.value.set(clim1, clim2);
        shaderArgs.uniforms.u_renderstyle.value = renderstyle === "mip" ? 0 : 1; // 0: MIP, 1: ISO
        shaderArgs.uniforms.u_renderthreshold.value = isothreshold; // For ISO renderstyle
        shaderArgs.uniforms.u_cmdata.value = cmtextures[colormap];
        shaderArgs.clipping = clipping;
        shaderArgs.clippingPlanes = clipping ? planes : [];
    });

    return (
        <>
            <mesh {...props} ref={meshRef}>
                {/* <bufferGeometry
                    // args={[geometryArgs]}
                    ref={geometryRef}
                /> */}
                <boxGeometry />
                <shaderMaterial args={[shaderArgs]} ref={materialRef} />
            </mesh>
            {/* {console.log(
                // geometryArgs,
                shaderArgs,
                geometryRef.current,
                materialRef
            )} */}
        </>
    );
}
