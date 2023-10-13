import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PivotControls,
    Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";

// ==========
// Game
import {
    // ----------
    // hook
    useToggle,
} from "../../../components/game";

// ==========
// Model
import { Board_Configure } from "../../../components/models";
import { CustomYBotIK } from "../../../components/models/Custom_Ybot_IK";
import { HandIKPivotControls } from "../../../components/models/controls";

// ==========
// Volume
// ----------
// object
import { Dosimeter, DoseGroup, DoseAnimationObject } from "../../../src";
// ----------
// data
import * as VOLUMEDATA from "../../../components/models/VolumeData";
// ----------
// controls
import {
    DoseAnimationControls,
    DoseBoardControls,
    DosimeterControls,
    DosimeterDisplayUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../../components/volumeRender";

// ==========
// UI
import { SceneConfigPanel } from "../../../components/ui";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Styles
import styles from "../../../styles/threejs.module.css";

function CArmRoll180Pitch360Extra() {
    const [debug, viewing] = useStore((state) => [state.debug, state.viewing]);

    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const cArmRollRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const cArmRollAccumuRef = useRef<DoseGroup>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);

    const ToggledDebug = useToggle(Debug, "debug");

    useEffect(() => {
        console.log(ref.current);
        // console.log(cArmRollRef);
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
                            <doseGroup
                                ref={timelapseRef}
                                clim2={
                                    VOLUMEDATA.CArm_roll180_pitch360_Configure
                                        .volume.clim2.timelapse
                                }
                                clim2AutoUpdate={false}
                            >
                                {/* C-Arm Dose */}
                                <doseAnimationObject
                                    ref={cArmRollRef}
                                    position={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.scale
                                    }
                                >
                                    <VOLUMEDATA.CArm_roll180_pitch360_all_Animation />
                                </doseAnimationObject>
                            </doseGroup>

                            {/* Accumulate */}
                            <doseGroup
                                ref={accumulateRef}
                                visible={false}
                                clim2={
                                    VOLUMEDATA.CArm_roll180_pitch360_Configure
                                        .volume.clim2.accumulate
                                }
                                clim2AutoUpdate={false}
                            >
                                {/* C-Arm Dose, Accumulate */}
                                <doseGroup
                                    ref={cArmRollAccumuRef}
                                    position={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA
                                            .CArm_roll180_pitch360_Configure
                                            .volume.scale
                                    }
                                >
                                    <VOLUMEDATA.CArm_roll180_pitch360_all_accumulate />
                                </doseGroup>
                            </doseGroup>
                        </doseGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <DoseAnimationControls
                            objects={[cArmRollRef]}
                            mainGroup={timelapseRef}
                            subGroup={accumulateRef}
                            duration={16}
                            customSpeed={[8.0, 16.0]}
                        />
                        <VolumeParameterControls object={ref} />
                        <VolumeXYZClippingControls
                            object={ref}
                            folderName="Clip"
                            planeSize={2}
                            subPlaneSize={1}
                        />

                        {/* Dosimeter */}
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
                            targets={[cArmRollAccumuRef]}
                        />

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
                        <mesh position={[0, 1, 0]} visible={debug}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        {/* Avatar */}
                        <PivotControls
                            matrix={new THREE.Matrix4().compose(
                                new THREE.Vector3(2, 0, 0),
                                new THREE.Quaternion().setFromEuler(
                                    new THREE.Euler(0, -Math.PI / 2, 0)
                                ),
                                new THREE.Vector3(1, 1, 1)
                            )}
                            scale={70}
                            fixed={true}
                            activeAxes={[true, false, true]}
                            visible={!viewing}
                            onDrag={(l, deltaL, w, deltaW) => {
                                yBotRef.current.position.setFromMatrixPosition(
                                    w
                                );
                                yBotRef.current.rotation.setFromRotationMatrix(
                                    w
                                );
                            }}
                            onDragEnd={() => {
                                if (dosimeterRef.current) {
                                    dosimeterRef.current.updateResults();
                                }
                            }}
                        />
                        <group
                            ref={yBotRef}
                            position={[2, 0, 0]}
                            rotation={[0, -Math.PI / 2, 0]}
                        >
                            <CustomYBotIK />
                            <HandIKPivotControls object={yBotRef} />
                        </group>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

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
                                planeSize={Board_Configure.size.y}
                                scale={50}
                                fixed={true}
                                offset={[0, 0, 0.1]}
                                opacity={0.75}
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
                    <SceneConfigPanel activateStats={false} />
                    <DosimeterDisplayUI />
                </div>
            </div>
        </>
    );
}

export default CArmRoll180Pitch360Extra;
