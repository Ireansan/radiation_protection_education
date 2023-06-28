import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeGroup, VolumeAnimationObject } from "../../src";
import {
    VolumeAnimationControls,
    DoseBoardControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";

import * as VOLUMEDATA from "../models/VolumeData";

function XRayRoomBoardPrototype() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation1 = useRef<VolumeAnimationObject>(null);
    const refAnimation2 = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
    }, [ref]);

    return (
        <>
            {/* ================================================== */}
            {/* Three.js Canvas */}
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* -------------------------------------------------- */}
                {/* Volume Object */}
                <volumeGroup ref={ref} renderOrder={3}>
                    {/* Original Data */}
                    <volumeAnimationObject
                        ref={refAnimation1}
                        position={[45, 0, 48]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                    >
                        <VOLUMEDATA.Dose_all_Animation />
                    </volumeAnimationObject>

                    {/* Data * 0.01 */}
                    <volumeAnimationObject
                        ref={refAnimation2}
                        position={[45, 0, 48]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                    >
                        <VOLUMEDATA.Dose_all_Animation_centi />
                    </volumeAnimationObject>

                    {/* <mesh position={[0, 0, 0]} scale={25}>
                        <sphereBufferGeometry />
                    </mesh> */}
                </volumeGroup>

                {/* -------------------------------------------------- */}
                {/* Volume Controls */}
                <VolumeAnimationControls
                    objects={[refAnimation1, refAnimation2]}
                    duration={16}
                />
                <VolumeParameterControls object={ref} />
                {/* <VolumeClippingControls
                    object={ref}
                    folderName="Dose"
                    normals={[
                        [0, 0, -1],
                        // [1, 0, 0],
                        [-1, 0, 0],
                        // [0, 1, 0],
                        // [0, -1, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                /> */}
                <VolumeClippingControls
                    object={ref}
                    folderName="Dose 2"
                    normals={[
                        // [0, 0, -1],
                        // [1, 0, 0],
                        // [-1, 0, 0],
                        // [0, 1, 0],
                        [0, -1, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                />
                <DoseBoardControls
                    object1={refAnimation1}
                    object2={refAnimation2}
                    origin={new THREE.Vector3(0, 0, 0)}
                    width={20}
                    height={50}
                    planeSize={100}
                    subPlaneSize={50}
                >
                    <mesh position={[0, 0, 0]}>
                        <boxBufferGeometry args={[20, 50, 0.05]} />
                    </mesh>
                </DoseBoardControls>

                {/* -------------------------------------------------- */}
                {/* Three.js Object */}
                <group rotation={[0, 0, Math.PI]} scale={1 / 4} renderOrder={1}>
                    <VOLUMEDATA.Dose_material />
                    <VOLUMEDATA.Dose_region />
                </group>

                {/* -------------------------------------------------- */}
                {/* Three.js Controls */}
                <OrbitControls makeDefault />

                <mesh position={[0, 0, 0]} scale={10} renderOrder={2}>
                    <sphereBufferGeometry />
                </mesh>

                {/* -------------------------------------------------- */}
                {/* Enviroment */}
                <ambientLight intensity={0.5} />

                {/* -------------------------------------------------- */}
                {/* UI */}
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
        </>
    );
}

export default XRayRoomBoardPrototype;
