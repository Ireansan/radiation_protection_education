import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    PivotControls,
    Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";
import { useControls, folder } from "leva";

// ==========
// Three.js
import { YBot } from "../../components/models";

// ==========
// Game
import {
    // ----------
    // ui
    DebugPanel,
    // ----------
    // hook
    useToggle,
} from "../../components/game";

// ==========
// Model
import { Board_Configure } from "../../components/models";
import { CustomYBotIK } from "../../components/models/Custom_Ybot_IK";
import { HandIKLevaControls } from "../../components/models/controls";

// ==========
// Volume
// ----------
// object
import {
    Dosimeter,
    DoseGroup,
    DoseAnimationObject,
    DoseBase,
    DoseObject,
} from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    DoseAnimationControls,
    DoseBoardControls,
    DosimeterControls,
    DosimeterDisplayUI,
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../components/volumeRender";

import styles from "../../styles/threejs.module.css";

function XRayRoomDosimeterPrototype() {
    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const nocurtainRef = useRef<DoseAnimationObject>(null);
    const curtainRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const nocurtainAccumuRef = useRef<DoseGroup>(null);
    const curtainAccumuRef = useRef<DoseGroup>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null);

    const ToggledDebug = useToggle(Debug, "debug");

    const [,] = useControls(() => ({
        scene: folder({
            curtain: {
                value: false,
                onChange: (e) => {
                    nocurtainRef.current
                        ? (nocurtainRef.current.visible = e)
                        : null;
                    curtainRef.current
                        ? (curtainRef.current.visible = !e)
                        : null;

                    nocurtainAccumuRef.current
                        ? (nocurtainAccumuRef.current.visible = e)
                        : null;
                    curtainAccumuRef.current
                        ? (curtainAccumuRef.current.visible = !e)
                        : null;
                },
            },
        }),
    }));

    useEffect(() => {
        console.log("ref useEffect");
    }, [nocurtainRef, curtainRef]);

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
    }, [ref]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas
                        orthographic
                        camera={{ position: [4, 8, 4], zoom: 50 }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}
                        <doseGroup ref={ref}>
                            {/* Time Lapse */}
                            <doseGroup ref={timelapseRef}>
                                {/* X-Ray Dose, no curtain */}
                                <doseAnimationObject
                                    ref={nocurtainRef}
                                    name={"x-ray_animation_nocurtain"}
                                    visible={false}
                                    position={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.scale
                                    }
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                </doseAnimationObject>
                                {/* X-Ray Dose, curtain */}
                                <doseAnimationObject
                                    ref={curtainRef}
                                    name={"x-ray_animation_curtain"}
                                    position={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .scale
                                    }
                                >
                                    <VOLUMEDATA.XRay_curtain_all_Animation />
                                </doseAnimationObject>
                            </doseGroup>

                            {/* Accumulate */}
                            <doseGroup ref={accumulateRef} visible={false}>
                                {/* X-Ray Dose, no curtain, Accumulate */}
                                <doseGroup
                                    ref={nocurtainAccumuRef}
                                    name={"x-ray_accumulate_nocurtain"}
                                    visible={false}
                                    position={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.scale
                                    }
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_accumulate />
                                </doseGroup>
                                {/* X-Ray Dose, curtain, Accumulate */}
                                <doseGroup
                                    ref={curtainAccumuRef}
                                    name={"x-ray_accumulate_curtain"}
                                    position={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .scale
                                    }
                                >
                                    <VOLUMEDATA.XRay_curtain_all_accumulate />
                                </doseGroup>
                            </doseGroup>
                        </doseGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <DoseAnimationControls
                            objects={[nocurtainRef, curtainRef]}
                            mainGroup={timelapseRef}
                            subGroup={accumulateRef}
                            duration={16}
                            customSpeed={[8.0, 16.0]}
                        />
                        <VolumeParameterControls object={ref} />
                        {/* <VolumeClippingControls
                            object={ref}
                            folderName="Dose 2"
                            normals={[
                                // [0, 0, -1],
                                // [1, 0, 0],
                                // [-1, 0, 0],
                                // [0, 1, 0],
                                [0, -1, 0],
                            ]}
                            planeSize={2}
                            subPlaneSize={1}
                        /> */}
                        <VolumeXYZClippingControls
                            object={ref}
                            folderName="Dose 3"
                            planeSize={2}
                            subPlaneSize={1}
                        />

                        <DosimeterControls
                            ref={dosimeterRef}
                            object={yBotRef}
                            names={[
                                { name: "mixamorigNeck", displayName: "Neck" },
                                {
                                    name: "mixamorigLeftEye",
                                    displayName: "Left Eye",
                                },
                                {
                                    name: "mixamorigRightEye",
                                    displayName: "Right Eye",
                                },
                                {
                                    name: "mixamorigLeftHand",
                                    displayName: "Left Hand",
                                },
                                {
                                    name: "mixamorigRightHand",
                                    displayName: "Right Hand",
                                },
                            ]}
                            targets={[
                                // nocurtainRef, curtainRef
                                nocurtainAccumuRef,
                                curtainAccumuRef,
                            ]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                    .position
                            }
                            rotation={
                                VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                    .rotation
                            }
                            scale={
                                VOLUMEDATA.XRay_nocurtain_Configure.volume
                                    .scale *
                                VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                    .scale
                            }
                        >
                            <VOLUMEDATA.XRay_nocurtain_material />
                            <VOLUMEDATA.XRay_nocurtain_region />
                        </group>
                        <mesh position={[0, 1, 0]}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        <PivotControls
                            // offset={[0, 0, -0.5]}
                            // rotation={[0, Math.PI, 0]}
                            matrix={new THREE.Matrix4().compose(
                                new THREE.Vector3(2, 0, 0),
                                new THREE.Quaternion().setFromEuler(
                                    new THREE.Euler(0, -Math.PI / 2, 0)
                                ),
                                new THREE.Vector3(1, 1, 1)
                            )}
                            activeAxes={[true, false, true]}
                            onDragEnd={() => {
                                if (dosimeterRef.current) {
                                    dosimeterRef.current.updateResults();
                                    console.log(
                                        dosimeterRef.current.results
                                        // refAnimation.current?.name
                                    );
                                }
                            }}
                        >
                            <group ref={yBotRef}>
                                <CustomYBotIK />
                            </group>
                        </PivotControls>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        <HandIKLevaControls object={yBotRef} />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            {/* Dose Board */}
                            <DoseBoardControls
                                object={ref}
                                origin={new THREE.Vector3(0, 1, 0)}
                                areaSize={[2.2, 1.2, 3.1]}
                                width={Board_Configure.size.x}
                                height={Board_Configure.size.y}
                                position={new THREE.Vector3(2.5, 1.25, -0.5)}
                                rotation={new THREE.Euler(0, Math.PI / 2, 0)}
                                offset={[0, 0, 0.1]}
                                opacity={0.75}
                                planeSize={Board_Configure.size.y}
                                pivotScale={Board_Configure.size.x}
                            >
                                <mesh position={[0, 0, 0]}>
                                    <boxBufferGeometry
                                        args={[
                                            ...Board_Configure.size.toArray(),
                                        ]}
                                    />
                                    <meshBasicMaterial
                                        color={new THREE.Color(0xb39a7b)}
                                    />
                                </mesh>
                            </DoseBoardControls>
                        </Physics>

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <ambientLight intensity={0.5} />

                        <Grid
                            position={[0, -0.01, 0]}
                            args={[10.5, 10.5]}
                            cellColor={"#121d7d"}
                            sectionColor={"#262640"}
                            fadeDistance={20}
                            followCamera
                            infiniteGrid
                            matrixWorldAutoUpdate={undefined}
                            getObjectsByProperty={undefined}
                            getVertexPosition={undefined}
                        />

                        {/* ================================================== */}
                        {/* UI */}
                        <Stats />

                        <GizmoHelper
                            alignment="bottom-right"
                            margin={[80, 80]}
                            renderPriority={1}
                        >
                            <GizmoViewport
                                axisColors={[
                                    "hotpink",
                                    "aquamarine",
                                    "#3498DB",
                                ]}
                                labelColor="black"
                            />
                        </GizmoHelper>
                    </Canvas>
                    <DosimeterDisplayUI />
                    <DebugPanel />
                </div>
            </div>
        </>
    );
}

export default XRayRoomDosimeterPrototype;
