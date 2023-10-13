import React, { useEffect, useRef } from "react";
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
// Volume
// ----------
// object
import { Dosimeter, VolumeGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    DoseBoardControls,
    DosimeterControls,
    DosimeterDisplayUI,
    VolumeAnimationControls,
    VolumeParameterControls,
} from "../../components/volumeRender";

import { CustomYBotIK } from "../../components/models/Custom_Ybot_IK";
import { HandIKLevaControls } from "../../components/models/controls";

import styles from "../../styles/threejs.module.css";

function XRayRoomDosimeterPrototype() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null);

    const ToggledDebug = useToggle(Debug, "debug");

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
                        <volumeGroup ref={ref}>
                            {/* X-Ray Dose, coefficent: 0.01 (1/100) */}
                            <doseAnimationObject
                                ref={refAnimation}
                                position={
                                    VOLUMEDATA.XRay_nocurtain_Configure.volume
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.XRay_nocurtain_Configure.volume
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.XRay_nocurtain_Configure.volume
                                        .scale
                                }
                                boardCoefficient={0.01}
                            >
                                <VOLUMEDATA.XRay_nocurtain_all_Animation />
                            </doseAnimationObject>
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeAnimationControls
                            objects={[refAnimation]}
                            duration={16}
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

                        <DosimeterControls
                            ref={dosimeterRef}
                            object={yBotRef}
                            names={[
                                {
                                    name: "mixamorigNeck",
                                    displayName: "Neck",
                                    category: "neck",
                                    coefficient: 0.1,
                                },
                                {
                                    name: "mixamorigLeftEye",
                                    displayName: "Left Eye",
                                    category: "goggle",
                                    coefficient: 0.1,
                                },
                                {
                                    name: "mixamorigRightEye",
                                    displayName: "Right Eye",
                                    category: "goggle",
                                    coefficient: 0.1,
                                },
                                {
                                    name: "mixamorigLeftHand",
                                    displayName: "Left Hand",
                                    category: "glove",
                                    coefficient: 0.1,
                                },
                                {
                                    name: "mixamorigRightHand",
                                    displayName: "Right Hand",
                                    category: "glove",
                                    coefficient: 0.1,
                                },
                            ]}
                            targets={[refAnimation]}
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
                                        // dosimeterRef.current,
                                        // yBotRef.current?.position,
                                        dosimeterRef.current.results
                                        // dosimeterRef.current?.object
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
                                object={refAnimation}
                                origin={new THREE.Vector3(0, 1, 0)}
                                areaSize={[2.2, 1.2, 3.1]}
                                width={1}
                                height={2}
                                position={new THREE.Vector3(2.5, 1.25, -0.5)}
                                rotation={new THREE.Euler(0, Math.PI / 2, 0)}
                                planeSize={2}
                                scale={1}
                            >
                                <mesh position={[0, 0, 0]}>
                                    <boxBufferGeometry args={[1, 2, 0.05]} />
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
