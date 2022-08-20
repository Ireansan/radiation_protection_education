/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, Suspense } from "react";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, TransformControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { TransformControls as TransformControlsImpl } from "three-stdlib";
import { useControls } from "leva";
import { useSnapshot } from "valtio";

import { NRRDLoader } from "./jsm/loaders/NRRDLoader";
import { volumeRenderShader } from "./shaders/volumeShader";

import {
    volumeRenderStates,
    planeConfigStates,
} from "./states/nrrd_view.states";

import styles from "../styles/nrrd_view.module.css";
// /*
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
            <mesh geometry={geometry} material={material}>
                {/* <PlaneControls /> */}
            </mesh>
        </>
    );
}
// */

function VolumeRenderControls() {
    const [volumeConfig, volumeSet] = useControls(() => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim2 = e;
            },
        },
        colormap: {
            options: ["viridis", "gray"],
            onChange: (e) => {
                if (e === "viridis") {
                    volumeRenderStates.colormap = 0;
                } else if (e === "gray") {
                    volumeRenderStates.colormap = 1;
                }
            },
        },
        renderstyle: {
            options: ["iso", "mip"],
            onChange: (e) => {
                volumeRenderStates.renderstyle = e;
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            // max: 100,
            onChange: (e) => {
                volumeRenderStates.isothreshold = e;
            },
        },
    }));

    return <></>;
}

function PlaneControls() {
    const { mode, space } = useSnapshot(planeConfigStates);
    const [planeConfig, planeSet] = useControls(() => ({
        position: {
            value: { x: 0, y: 0, z: 0 },
        },
        rotation: {
            value: { x: 0, y: 0, z: 0 },
        },
        mode: {
            value: "translate",
            options: ["translate", "rotate"],
            onChange: (e) => {
                planeConfigStates.mode = e;
            },
        },
        space: {
            value: "world",
            options: ["world", "local"],
            onChange: (e) => {
                planeConfigStates.space = e;
            },
        },
    }));

    function Plane(props: any) {
        return (
            <mesh {...props}>
                <planeGeometry />
            </mesh>
        );
    }
    console.log(mode, space);

    return (
        <>
            <TransformControls
                mode={mode}
                space={space}
                onChange={(e) => {
                    if (e?.target.mode === "translate") {
                        volumeRenderStates.position =
                            e?.target.object?.position;
                        console.log(e?.target.object?.position);
                    } else if (e?.target.mode === "rotate") {
                        volumeRenderStates.position = e?.target.object?.up;
                        console.log(e?.target.object?.up);
                    }
                    // console.log(e?.target);
                }}
            >
                <Plane />
            </TransformControls>
        </>
    );
}

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function NRRDView() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();

    const { clim1, clim2, colormap, renderstyle, isothreshold, position, up } =
        useSnapshot(volumeRenderStates);

    useEffect(() => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.copy(
            new THREE.OrthographicCamera(
                (-h * aspect) / 2,
                (h * aspect) / 2,
                h / 2,
                -h / 2,
                1,
                1000
            )
        );
        camera.position.set(-64, -64, 128);
        camera.up.set(0, 0, 1); // In our data, z is up
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <Suspense fallback={null}>
                        <VolumeRender
                            clim1={clim1}
                            clim2={clim2}
                            colormap={colormap}
                            renderstyle={renderstyle}
                            isothreshold={isothreshold}
                            position={position}
                            up={up}
                        />
                    </Suspense>
                    <VolumeRenderControls />
                    <PlaneControls />
                    <OrbitControls makeDefault />

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default NRRDView;
