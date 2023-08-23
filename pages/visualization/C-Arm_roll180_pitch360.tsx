import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
} from "@react-three/drei";
import * as THREE from "three";

// ==========
// Volume
// ----------
// object
import { VolumeGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeAnimationControls,
    DoseBoardControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../../components/volumeRender";

import styles from "../../styles/threejs.module.css";

function CArmRoll180Pitch360() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

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
                                    VOLUMEDATA.CArm_roll180_pitch360_Configure
                                        .volume.position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_roll180_pitch360_Configure
                                        .volume.rotation
                                }
                                scale={
                                    VOLUMEDATA.CArm_roll180_pitch360_Configure
                                        .volume.scale
                                }
                                coefficient={1.0}
                                boardCoefficient={0.01}
                            >
                                <VOLUMEDATA.CArm_roll180_pitch360_all_Animation />
                            </doseAnimationObject>

                            {/* <mesh position={[0, 0, 0]} scale={25}>
                        <sphereBufferGeometry />
                    </mesh> */}
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeAnimationControls
                            objects={[refAnimation]}
                            duration={16}
                        />
                        <VolumeParameterControls object={ref} />
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
                            planeSize={2}
                            subPlaneSize={1}
                        />
                        <DoseBoardControls
                            object={refAnimation}
                            origin={new THREE.Vector3(0, 1, 0)}
                            width={1}
                            height={2}
                            position={new THREE.Vector3(1, 1.25, -0.5)}
                            rotation={new THREE.Euler(0, Math.PI / 2, 0)}
                            planeSize={2}
                            subPlaneSize={1}
                        >
                            <mesh>
                                <boxBufferGeometry args={[1, 2, 0.05]} />
                            </mesh>
                        </DoseBoardControls>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                VOLUMEDATA.CArm_roll180_pitch360_Configure
                                    .object3d.position
                            }
                            rotation={
                                VOLUMEDATA.CArm_roll180_pitch360_Configure
                                    .object3d.rotation
                            }
                            scale={
                                VOLUMEDATA.CArm_roll180_pitch360_Configure
                                    .volume.scale *
                                VOLUMEDATA.CArm_roll180_pitch360_Configure
                                    .object3d.scale
                            }
                        >
                            <VOLUMEDATA.CArm_roll180_pitch360_material />
                            <VOLUMEDATA.CArm_roll180_pitch360_region />
                        </group>
                        <mesh position={[0, 1, 0]}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

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
                </div>
            </div>
        </>
    );
}

export default CArmRoll180Pitch360;