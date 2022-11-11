import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import volumeRenderShader from "../shaders/volumeShader";
import { applyBasePath } from "../../utils";

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
        new THREE.ShaderMaterial({})
    );

    // Geometry
    const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BoxGeometry());

    // Colormap
    const cmtexturesRef = useRef<{ [index: string]: THREE.Texture }>(null!);

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
        // Colormap
        cmtexturesRef.current = {
            parula: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_parula.png`)
            ),
            heat: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_heat.png`)
            ),
            jet: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_jet.png`)
            ),
            turbo: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_turbo.png`)
            ),
            hot: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_hot.png`)
            ),
            gray: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_gray.png`)
            ),
            magma: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_magma.png`)
            ),
            inferno: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_inferno.png`)
            ),
            plasma: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_plasma.png`)
            ),
            viridis: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_viridis.png`)
            ),
            cividis: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_cividis.png`)
            ),
            github: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_github.png`)
            ),
            cubehelix: new THREE.TextureLoader().load(
                applyBasePath(`/textures/colormap/cm_cubehelix.png`)
            ),
        };

        // Texture
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        // Material
        const uniforms = THREE.UniformsUtils.clone(volumeRenderShader.uniforms);
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
        meshRef.current.updateMatrixWorld();
        uniforms.u_modelMatrix.value = meshRef.current.matrixWorld;
        materialRef.current.clipping = clipping;
        if (clipping) {
            materialRef.current.clippingPlanes = planes;
        }

        materialRef.current.uniforms = uniforms;
        materialRef.current.vertexShader = volumeRenderShader.vertexShader;
        materialRef.current.fragmentShader = volumeRenderShader.fragmentShader;
        materialRef.current.side = THREE.BackSide; // The volume shader uses the backface as its "reference point"
    }, []);

    useEffect(() => {
        materialRef.current.uniforms.u_data.value = texture;
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
        meshRef.current.updateMatrixWorld();
        materialRef.current.uniforms.u_modelMatrix.value =
            meshRef.current.matrixWorld;
        materialRef.current.clipping = clipping;
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
