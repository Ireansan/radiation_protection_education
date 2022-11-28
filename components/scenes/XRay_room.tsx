import React, { useEffect, useRef, forwardRef } from "react";

import { Canvas, extend, ReactThreeFiber } from "@react-three/fiber";
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

import { VolumeGroup, VolumeControls } from "../volumeRender";
extend({ VolumeGroup });
declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeGroup: ReactThreeFiber.Object3DNode<
            VolumeGroup,
            typeof VolumeGroup
        >;
    }
}
import * as MODELS from "../models";
import * as SCENES from "./index";

function XRayRoom() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* <VolumeControls
                    normals={[
                        [0, 0, -1],
                        [-1, 0, 0],
                    ]}
                > */}
                <volumeGroup ref={ref}>
                    <SCENES.Dose_all_Animation
                        position={[45, 0, 48]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                    />
                </volumeGroup>
                {/* </VolumeControls> */}
                <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                <VolumeControls
                    object={ref}
                    normals={[
                        [0, 0, -1],
                        [-1, 0, 0],
                    ]}
                />
                {/* <VolumeAnimationControls object={ref} /> */}

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
