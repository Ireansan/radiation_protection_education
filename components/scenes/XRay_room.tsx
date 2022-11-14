import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrthographicCamera,
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Box,
    Sphere,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeControls, ClippingPlaneControls } from "../volumeRender";
import * as MODELS from "../models";
import * as SCENES from "./index";

function XRayRoom() {
    return (
        <>
            <Canvas camera={{ position: [16, 32, 16] }}>
                <VolumeControls>
                    <ClippingPlaneControls
                        normals={[
                            [0, 0, -1],
                            [-1, 0, 0],
                        ]}
                    >
                        <SCENES.Dose_all_Animation
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        />
                    </ClippingPlaneControls>
                </VolumeControls>
                <group rotation={[0, 0, Math.PI]} scale={1 / 5}>
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                <ambientLight intensity={0.5} />
                <OrthographicCamera />
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
