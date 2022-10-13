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
    // Stores
    volumeStore,
    clippingPlaneStore,
    // Components
    VolumeRenderAnimation,
    VolumeRenderControls,
} from "../../components/volumeRender";
import * as Models from "../../components/models";

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
    const setCmtextures = volumeStore((state) => state.setCmtextures);
    const setNormal = clippingPlaneStore((state) => state.setNormal);
    const setPlane = clippingPlaneStore((state) => state.setPlane);

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

        // cmtextures
        setCmtextures([
            new THREE.TextureLoader().load("/textures/cm_viridis.png"),
            new THREE.TextureLoader().load("/textures/cm_gray.png"),
        ]);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <Suspense fallback={null}>
                        <VolumeRenderAnimation rotation={[0, Math.PI / 2, 0]}>
                            <Models.Dose_1 clipping={true} />
                            <Models.Dose_2 clipping={true} />
                            <Models.Dose_3 clipping={true} />
                            <Models.Dose_4 clipping={true} />
                            <Models.Dose_5 clipping={true} />
                            <Models.Dose_6 clipping={true} />
                            <Models.Dose_7 clipping={true} />
                            <Models.Dose_8 clipping={true} />
                            <Models.Dose_9 clipping={true} />
                            <Models.Dose_10 clipping={true} />
                            <Models.Dose_11 clipping={true} />
                            <Models.Dose_12 clipping={true} />
                            <Models.Dose_13 clipping={true} />
                            <Models.Dose_14 clipping={true} />
                            <Models.Dose_15 clipping={true} />
                            <Models.Dose_16 clipping={true} />
                        </VolumeRenderAnimation>
                    </Suspense>

                    <VolumeRenderControls clipping={true} animation={true} />
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
