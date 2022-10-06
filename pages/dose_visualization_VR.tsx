import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useMemo, useEffect, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";

import {
    // Stores
    volumeStore,
    clippingPlaneStore,
    // Components
    VolumeRenderAnimation,
    VolumeRenderControls,
} from "../components/volumeRender";
import * as Models from "../components/models";

import styles from "../styles/threejs.module.css";

function DoseVisualization() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();
    const setCmtextures = volumeStore((state) => state.setCmtextures);
    const { setNormal } = clippingPlaneStore();

    // Init
    useEffect(() => {
        // Setup Camera
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
        camera.up.set(0, 0, 1); // z up

        // volumeStates.rotation.set(0, Math.PI / 2, 0);

        // cmtextures
        setCmtextures([
            new THREE.TextureLoader().load("textures/cm_viridis.png"),
            new THREE.TextureLoader().load("textures/cm_gray.png"),
        ]);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <VRButton />
                <Canvas camera={camera}>
                    <XR>
                        <Suspense fallback={null}>
                            <VolumeRenderAnimation>
                                <Models.Dose />
                                <Models.Dose_106_200_290 />
                                <Models.Dose_d100 />
                                <Models.Stent />
                            </VolumeRenderAnimation>
                        </Suspense>
                    </XR>

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default DoseVisualization;
