import React, { useEffect, useRef, forwardRef } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeAnimationObject, VolumeGroup } from "../../src";
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";

import { VolumeCompareControls } from "../volumeRender/VolumeCompareControls";

import * as VOLUMEDATA from "../models/VolumeData";

function XRayCurtain() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refCurtain = useRef<VolumeGroup>(null);
    const refCurtainAnimation = useRef<VolumeAnimationObject>(null);
    const refNocurtain = useRef<VolumeGroup>(null);
    const refNocurtainAnimation = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            {/* ================================================== */}
            {/* Three.js Canvas */}
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* -------------------------------------------------- */}
                {/* Volume Objects */}
                <volumeGroup ref={ref}>
                    {/* Curtain */}
                    <volumeGroup
                        ref={refCurtain}
                        volumeClippingAutoUpdate={false}
                    >
                        <volumeAnimationObject
                            ref={refCurtainAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <VOLUMEDATA.Dose_curtain_all_Animation />
                        </volumeAnimationObject>

                        <mesh position={[-50, 0, 0]} scale={25}>
                            <sphereBufferGeometry />
                        </mesh>
                    </volumeGroup>

                    {/* Nocurtain */}
                    <volumeGroup
                        ref={refNocurtain}
                        volumeClippingAutoUpdate={false}
                    >
                        <volumeAnimationObject
                            ref={refNocurtainAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <VOLUMEDATA.Dose_nocurtain_all_Animation />
                        </volumeAnimationObject>

                        <mesh position={[50, 0, 0]} scale={25}>
                            <boxBufferGeometry />
                        </mesh>
                    </volumeGroup>
                </volumeGroup>

                {/* -------------------------------------------------- */}
                {/* Volume Contorls */}
                <VolumeAnimationControls
                    objects={[refCurtainAnimation, refNocurtainAnimation]}
                    duration={16}
                />
                <VolumeParameterControls object={ref} />
                {/* <VolumeCompareControls
                    object1={refCurtain}
                    object2={refNocurtain}
                    normals={[
                        [0, 0, -1],
                        // [-1, 0, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                /> */}

                {/* -------------------------------------------------- */}
                {/* Three.js Object */}
                <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                    <VOLUMEDATA.Dose_material />
                    <VOLUMEDATA.Dose_region />
                </group>

                {/* Helper */}
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

                {/* -------------------------------------------------- */}
                {/* Enviroment */}
                <ambientLight intensity={0.5} />
                <OrbitControls makeDefault />
            </Canvas>

            {/* ================================================== */}
            {/* UI */}
            <Stats />
        </>
    );
}

export default XRayCurtain;
