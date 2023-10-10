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
import { Physics, Debug } from "@react-three/rapier";

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

function CArm() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

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
                                    VOLUMEDATA.CArm_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.CArm_Configure.volume.scale}
                                boardCoefficient={0.01}
                            >
                                <VOLUMEDATA.CArm_all_Animation />
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
                        <VolumeParameterControls object={ref} clim2={1e-5} />
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

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                VOLUMEDATA.CArm_Configure.object3d.position
                            }
                            rotation={
                                VOLUMEDATA.CArm_Configure.object3d.rotation
                            }
                            scale={
                                VOLUMEDATA.CArm_Configure.volume.scale *
                                VOLUMEDATA.CArm_Configure.object3d.scale
                            }
                        >
                            <VOLUMEDATA.CArm_material />
                            <VOLUMEDATA.CArm_region />
                        </group>
                        <mesh position={[0, 1, 0]}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

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
                                pivotScale={1}
                            >
                                <mesh>
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
                    <DebugPanel />
                </div>
            </div>
        </>
    );
}

export default CArm;
