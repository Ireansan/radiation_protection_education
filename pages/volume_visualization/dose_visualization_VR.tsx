import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useMemo, useEffect, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import {
    VolumeControls,
    ClippingPlaneControls,
} from "../../components/volumeRender";
import * as Scenes from "../../components/scenes";

import styles from "../../styles/threejs.module.css";

function DoseVisualizationVR() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();

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
        camera.position.set(-64, -64, 128);
        camera.up.set(0, 0, 1); // z up
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <VRButton />
                <Canvas camera={camera}>
                    <XR>
                        <VolumeControls>
                            <ClippingPlaneControls normal={[0, 0, -1]}>
                                <Scenes.XRayRoomAnimation />
                            </ClippingPlaneControls>
                        </VolumeControls>
                    </XR>
                </Canvas>

                <Stats />
            </div>
        </div>
    );
}

export default DoseVisualizationVR;
