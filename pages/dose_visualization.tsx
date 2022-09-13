import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import VolumeRender from "../components/volumeRender";
import VolumeRenderControls from "../components/volumeRender.Controls";

import styles from "../styles/nrrd_view.module.css";

function DoseVisualization() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();

    // nrrd
    var filepaths = [
        "/models/nrrd/dose_106_200_290.nrrd",
        "/models/nrrd/stent.nrrd",
        "/models/nrrd/dose_d100.nrrd",
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
        camera.up.set(0, 0, 1); // In our data, z is up
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <Suspense fallback={null}>
                        <VolumeRender filepath={filepaths} />
                    </Suspense>

                    <VolumeRenderControls />
                    <OrbitControls makeDefault />

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

export default DoseVisualization;
