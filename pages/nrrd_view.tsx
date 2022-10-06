/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import {
    // States
    volumeStore,
    clippingPlaneStore,
    // Loader
    volumeLoader,
    // Components
    VolumeRenderAnimation,
    VolumeRenderControls,
} from "../components/volumeRender";
import * as Models from "../components/models";

import styles from "../styles/threejs.module.css";

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

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function NRRDView() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();
    const setCmtextures = volumeStore((state) => state.setCmtextures);

    // Init
    useEffect(() => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.copy(
            new THREE.OrthographicCamera(
                (-h * aspect) / 2,
                (h * aspect) / 2,
                h / 2,
                -h / 2,
                0.001,
                1000
            )
        );
        camera.position.set(-64, -64, 128);
        camera.up.set(0, 0, 1); // In our data, z is up

        // cmtextures
        setCmtextures([
            new THREE.TextureLoader().load("textures/cm_viridis.png"),
            new THREE.TextureLoader().load("textures/cm_gray.png"),
        ]);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <Suspense fallback={null}>
                        <Models.Stent clipping={true} />
                    </Suspense>

                    <VolumeRenderControls clipping={true} />
                    <OrbitControls makeDefault />

                    {/* <Box scale={[10, 10, 10]} position={[-10, 4.6, -3]} /> */}
                    {/* <Box scale={[10, 10, 10]} position={[0, 0, 0]} /> */}

                    <Stats />
                    <GizmoHelper
                        alignment="bottom-right"
                        margin={[80, 80]}
                        renderPriority={-1}
                    >
                        <GizmoViewport
                            axisColors={["hotpink", "aquamarine", "#3498DB"]}
                            labelColor="black"
                        />
                    </GizmoHelper>
                </Canvas>
            </div>
        </div>
    );
}

export default NRRDView;
