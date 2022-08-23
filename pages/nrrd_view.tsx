/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { useSnapshot } from "valtio";

import { VolumeRender } from "./components/volumeRender";
import {
    volumeRenderStates,
    planeConfigStates,
} from "./states/nrrd_view.states";

import styles from "../styles/nrrd_view.module.css";

const Plane = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <planeGeometry />
            </mesh>
        </>
    );
};

const Box = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <boxGeometry />
            </mesh>
        </>
    );
};

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
    // console.log(mode, space);

    return (
        <>
            <TransformControls
                mode={mode}
                space={space}
                onChange={(e) => {
                    console.log(
                        e?.target.object?.position,
                        e?.target.object?.rotation,
                        e?.target.object?.up,
                        e?.target.object?.matrix,
                        e?.target.object
                    );

                    volumeRenderStates.position = e?.target.object?.position;
                    var tmpMatrix4 =
                        e?.target.object?.matrix ?? new THREE.Matrix4();
                    volumeRenderStates.plane.applyMatrix4(tmpMatrix4);
                    volumeRenderStates.up = volumeRenderStates.plane.up;
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
                        <VolumeRender />
                    </Suspense>

                    <VolumeRenderControls />
                    <PlaneControls />
                    <Plane />
                    <OrbitControls makeDefault />

                    <Box position={[100, 0, 0]} scale={[50, 50, 50]} />
                    <Box position={[0, 100, 0]} scale={[50, 50, 50]} />
                    <Box position={[0, 0, 100]} scale={[50, 50, 50]} />

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default NRRDView;
