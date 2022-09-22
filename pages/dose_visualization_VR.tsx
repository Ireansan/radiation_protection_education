import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";

import VolumeRender from "../components/volumeRender";
// import VolumeRenderControls from "../components/volumeRender.Controls";

import volumeRenderStates from "../lib/states/volumeRender.state";
import clippingPlaneStore from "../lib/states/clippingPlane.state";

import styles from "../styles/threejs.module.css";

function DoseVisualization() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();
    const { setNormal } = clippingPlaneStore();

    // nrrd
    var filepaths = [
        "models/nrrd/dose_106_200_290.nrrd",
        "models/nrrd/stent.nrrd",
        "models/nrrd/dose_d100.nrrd",
    ];

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
        camera.up.set(0, 0, 1); // z up

        volumeRenderStates.modelRotation.set(0, Math.PI / 2, 0);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <VRButton />
                <Canvas camera={camera}>
                    <XR>
                        <Suspense fallback={null}>
                            <VolumeRender filepath={filepaths} />
                        </Suspense>
                    </XR>

                    <Stats />
                </Canvas>
            </div>
        </div>
    );
}

export default DoseVisualization;
