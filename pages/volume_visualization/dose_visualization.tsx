import { NextPage, GetStaticProps } from "next";
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
    VolumeControls,
    ClippingPlaneControls,
} from "../../components/volumeRender";
import * as Scenes from "../../components/scenes";

import styles from "../../styles/threejs.module.css";

const Box = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <boxGeometry />
            </mesh>
        </>
    );
};

function DoseVisualization() {
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
                <Canvas camera={camera}>
                    <VolumeControls>
                        <ClippingPlaneControls normal={[0, 0, -1]}>
                            <Scenes.XRayRoomAnimation />
                        </ClippingPlaneControls>
                    </VolumeControls>

                    <OrbitControls makeDefault />

                    <Box scale={[10, 10, 10]} position={[0, 0, 0]} />

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
                <Stats />
            </div>
        </div>
    );
}

export default DoseVisualization;
