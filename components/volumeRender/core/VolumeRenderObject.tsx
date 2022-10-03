/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import volumeRenderShader from "../../../lib/shaders/volumeShader";

/**
 * VolumeRenderObject
 *  Core
 * @param volume: any
 * @param position?: THREE.Vector3, Default (0, 0, 0)
 * @param rotation?: THREE.Euler, Default (0, 0, 0)
 * @param scale?: THREE.Vector3, Default (1, 1, 1)
 * @param cmtextures: THREE.Texture[]
 * @param clim1?: number, Default 0
 * @param clim2?: number, Default 1
 * @param colormap: number
 * @param renderstyle: string
 * @param isothreshold: number
 * @param plane?: THREE.Plane
 */
type volumeRenderObjArgs = {
    volume: any;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    cmtextures: THREE.Texture[];
    clim1?: number;
    clim2?: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
    plane?: THREE.Plane;
};
function VolumeRenderObject({
    volume,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    cmtextures,
    clim1 = 0,
    clim2 = 1,
    colormap,
    renderstyle,
    isothreshold,
    plane,
    ...props
}: volumeRenderObjArgs) {
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
        // Mesh
        meshRef.current.position.copy(position);
        meshRef.current.rotation.copy(rotation);
        meshRef.current.scale.copy(scale);

        // Texture
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

        const modelMatrix = new THREE.Matrix4().compose(
            position,
            new THREE.Quaternion().setFromEuler(rotation),
            scale
        );
        uniforms.u_modelMatrix.value = modelMatrix;

        materialRef.current.side = THREE.BackSide; // The volume shader uses the backface as its "reference point"
        materialRef.current.clipping = true;
        materialRef.current.clippingPlanes = [plane];
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
        materialRef.current.uniforms.u_cmdata.value = cmtextures[colormap];
        materialRef.current.clippingPlanes = [plane];
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

export default VolumeRenderObject;
