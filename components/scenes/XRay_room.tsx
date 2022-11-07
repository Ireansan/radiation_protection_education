import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeControls, ClippingPlaneControls } from "../volumeRender";
import * as MODELS from "../models";
import * as SCENES from "./index";

const Box = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <boxGeometry />
            </mesh>
        </>
    );
};

function XRayRoom() {
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
        camera.position.set(8, 16, 8);
    }, []);

    return (
        <>
            <Canvas camera={camera}>
                <ambientLight intensity={0.5} />

                <group>
                    <VolumeControls>
                        <ClippingPlaneControls>
                            <SCENES.XRayRoomAnimation
                                position={[45, 0, 48]}
                                rotation={[0, Math.PI, -Math.PI / 2]}
                            />
                        </ClippingPlaneControls>
                    </VolumeControls>
                    <group
                        rotation={[0, 0, Math.PI]}
                        scale={[1 / 6, 1 / 6, 1 / 6]}
                    >
                        <MODELS.Dose_material />
                        <MODELS.Dose_region />
                    </group>
                </group>

                <OrbitControls makeDefault />

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
        </>
    );
}

export default XRayRoom;
