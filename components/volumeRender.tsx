/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React, {
    useRef,
    useLayoutEffect,
    useState,
    useEffect,
    useMemo,
} from "react";

import { useLoader, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "../lib/jsm/loaders/NRRDLoader";
import volumeRenderShader from "../lib/shaders/volumeShader";
import volumeRenderStates from "../lib/states/volumeRender.state";
import { animationStates } from "../lib/states/volumeRender.Controls.state";
import clippingPlaneStore from "../lib/states/clippingPlane.state";

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
    ...props
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

    useLayoutEffect(() => {
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

    useEffect(() => {
        materialRef.current.uniforms.u_data.value = texture;
        materialRef.current.uniforms.u_size.value.set(
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
    }, [volume]);

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
            <mesh geometry={geometry} {...props}>
                <shaderMaterial ref={materialRef} />
            </mesh>
        </>
    );
}

function LoadVolume(filepath: string) {
    return useLoader(NRRDLoader, filepath);
}

type volumeRenderSysArg = {
    cmtextures: THREE.Texture[];
};
function VolumeRenderSystem({ cmtextures, ...props }: volumeRenderSysArg) {
    const { volume, clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volumeRenderStates);
    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

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
                {...props}
            />
        </>
    );
}

type volumeRenderArg = {
    filepath: string | string[];
};
function VolumeRender({ filepath, ...props }: volumeRenderArg) {
    const { animate, speed } = useSnapshot(animationStates);

    // Colormap textures
    const cmtextures = [
        new THREE.TextureLoader().load("textures/cm_viridis.png"),
        new THREE.TextureLoader().load("textures/cm_gray.png"),
    ];

    // Load nrrd
    // const volume: any = useLoader(NRRDLoader, filepath);
    const volumes: any[] = useMemo(() => {
        if (Array.isArray(filepath)) {
            return filepath.map((fp) => LoadVolume(fp));
        } else {
            return [LoadVolume(filepath)];
        }
    }, [filepath]);

    useEffect(() => {
        volumeRenderStates.volume = volumes[0];
    }, []);

    const [volumesLen, setLength] = useState<number>(() => {
        if (Array.isArray(filepath)) {
            return filepath.length;
        } else {
            return 1;
        }
    });

    useFrame(({ clock }) => {
        const time: number = clock.elapsedTime * speed;
        if (animate) {
            // volume = volumes[Math.floor(time % volumesLen)];
            volumeRenderStates.volume = volumes[Math.floor(time % volumesLen)];
            console.log(Math.floor(time % volumesLen));
        }
    });

    return (
        <>
            <VolumeRenderSystem cmtextures={cmtextures} {...props} />
        </>
    );
}

export default VolumeRender;
