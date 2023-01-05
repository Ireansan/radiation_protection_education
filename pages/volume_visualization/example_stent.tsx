/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrthographicCamera,
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeControls } from "../../components/volumeRender";
import * as Models from "../../components/models";

import styles from "../../styles/threejs.module.css";

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
function ExampleStent() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={{ position: [64, 128, 64] }}>
                    <VolumeControls
                        normals={[
                            [0, -1, 0],
                            [-1, 0, 0],
                        ]}
                    >
                        <Models.Stent rotation={[-Math.PI / 2, 0, 0]} />
                    </VolumeControls>

                    <OrthographicCamera />
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

export default ExampleStent;
