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
            <Canvas orthographic camera={{ position: [4, 8, 4], zoom: 50 }}>
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
                            position={
                                VOLUMEDATA.Dose_curtain_Configure.volume
                                    .position
                            }
                            rotation={
                                VOLUMEDATA.Dose_curtain_Configure.volume
                                    .rotation
                            }
                            scale={
                                VOLUMEDATA.Dose_curtain_Configure.volume.scale
                            }
                        >
                            <VOLUMEDATA.Dose_curtain_all_Animation />
                        </volumeAnimationObject>

                        <mesh position={[-5, 0, 0]}>
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
                            position={
                                VOLUMEDATA.Dose_nocurtain_Configure.volume
                                    .position
                            }
                            rotation={
                                VOLUMEDATA.Dose_nocurtain_Configure.volume
                                    .rotation
                            }
                            scale={
                                VOLUMEDATA.Dose_nocurtain_Configure.volume.scale
                            }
                        >
                            <VOLUMEDATA.Dose_nocurtain_all_Animation />
                        </volumeAnimationObject>

                        <mesh position={[5, 0, 0]}>
                            <boxBufferGeometry />
                        </mesh>
                    </volumeGroup>
                </volumeGroup>

                {/* -------------------------------------------------- */}
                {/* Volume Controls */}
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
                <group
                    position={
                        VOLUMEDATA.Dose_curtain_Configure.object3d.position
                    }
                    rotation={
                        VOLUMEDATA.Dose_curtain_Configure.object3d.rotation
                    }
                    scale={VOLUMEDATA.Dose_curtain_Configure.object3d.scale}
                >
                    <VOLUMEDATA.Dose_material />
                    <VOLUMEDATA.Dose_region />
                </group>

                {/* -------------------------------------------------- */}
                {/* Three.js Controls */}
                <OrbitControls makeDefault />

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

export default XRayCurtain;
