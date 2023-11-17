import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PivotControls,
    Loader,
    Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";
import { useControls, folder } from "leva";

// ==========
// Game
import {
    // ----------
    // ui
    DebugPanel,
    // ----------
    // hook
    useToggle,
} from "../../../components/game";

// ==========
// Model
import * as MODELS from "../../../components/models";
import { Board_Configure } from "../../../components/models";
import { CustomYBotIK } from "../../../components/models/Player";
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
    DoseEquipmentsUI,
    DosimeterControls,
    DosimeterUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../../components/volumeRender";

// ==========
// UI
import { ExperimentCheckList, SceneConfigPanel } from "../../../components/ui";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Styles
import styles from "../../../styles/threejs.module.css";

function CArmExtra() {
    const [set, debug, viewing] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
    ]);

    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const cArmRef = useRef<DoseAnimationObject>(null);
    const cArmRoll180Pitch360Ref = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const cArmAccumuRef = useRef<DoseGroup>(null);
    const cArmRoll180Pitch360AccumuRef = useRef<DoseGroup>(null);

    const patientRef = useRef<THREE.Group>(null!);
    const cArmModelRef = useRef<THREE.Group>(null!);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);

    const options = ["type 1", "type 2"];
    const cArmConfigs = [
        {
            model: { ...VOLUMEDATA.CArm_Configure.object3d.model },
            patient: { ...VOLUMEDATA.CArm_Configure.object3d.patient },
        },
        {
            model: {
                ...VOLUMEDATA.CArm_roll180_pitch360_Configure.object3d.model,
            },
            patient: {
                ...VOLUMEDATA.CArm_roll180_pitch360_Configure.object3d.patient,
            },
        },
    ];
    const refs = [
        { time: cArmRef, accumu: cArmAccumuRef },
        { time: cArmRoll180Pitch360Ref, accumu: cArmRoll180Pitch360AccumuRef },
    ];

    const ToggledDebug = useToggle(Debug, "debug");

    const [,] = useControls(() => ({
        Scene: folder({
            Gimmick: folder({
                type: {
                    options: options,
                    value: options[0],
                    onChange: (e) => {
                        const visibles = options.map((value) => value === e);

                        visibles.forEach((value, index) => {
                            let config = cArmConfigs[index];

                            let refTime = refs[index].time.current;
                            refTime ? (refTime.visible = value) : null;
                            let refAccumu = refs[index].accumu.current;
                            refAccumu ? (refAccumu.visible = value) : null;

                            if (value) {
                                MODELS.updateCArmModel(
                                    cArmModelRef,
                                    config.model.position,
                                    config.model.rotation,
                                    config.model.roll,
                                    config.model.pitch,
                                    config.model.height,
                                );
                                if (patientRef.current) {
                                    patientRef.current.position.set(
                                        ...config.patient.position,
                                    );
                                    patientRef.current.rotation.set(
                                        ...config.patient.rotation,
                                    );
                                    patientRef.current.scale.setScalar(
                                        config.patient.scale,
                                    );
                                }
                            }
                        });
                    },
                },
            }),
        }),
    }));

    useEffect(() => {
        console.log(ref.current);
        // console.log(cArmRef);
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
                        <Suspense fallback={null}>
                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup
                                ref={ref}
                                position={
                                    VOLUMEDATA.CArm_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.CArm_Configure.volume.scale}
                            >
                                {/* Time Lapse */}
                                <doseGroup
                                    ref={timelapseRef}
                                    clim2={
                                        VOLUMEDATA.CArm_Configure.volume.clim2
                                            .timelapse
                                    }
                                    clim2AutoUpdate={false}
                                >
                                    {/* C-Arm Dose */}
                                    <doseAnimationObject ref={cArmRef}>
                                        <VOLUMEDATA.CArm_all_Animation />
                                    </doseAnimationObject>

                                    {/* C-Arm Roll 180 Pitch 360 Dose */}
                                    <doseAnimationObject
                                        ref={cArmRoll180Pitch360Ref}
                                        visible={false}
                                    >
                                        <VOLUMEDATA.CArm_roll180_pitch360_all_Animation />
                                    </doseAnimationObject>
                                </doseGroup>

                                {/* Accumulate */}
                                <doseGroup
                                    ref={accumulateRef}
                                    visible={false}
                                    clim2={
                                        VOLUMEDATA.CArm_Configure.volume.clim2
                                            .accumulate
                                    }
                                    clim2AutoUpdate={false}
                                >
                                    {/* C-Arm Dose, Accumulate */}
                                    <doseGroup ref={cArmAccumuRef}>
                                        <VOLUMEDATA.CArm_all_accumulate />
                                    </doseGroup>

                                    {/* C-Arm Roll 180 Pitch 360 Dose, Accumulate */}
                                    <doseGroup
                                        ref={cArmRoll180Pitch360AccumuRef}
                                        visible={false}
                                    >
                                        <VOLUMEDATA.CArm_roll180_pitch360_all_accumulate />
                                    </doseGroup>
                                </doseGroup>
                            </doseGroup>

                            {/* -------------------------------------------------- */}
                            {/* Volume Controls */}
                            <DoseAnimationControls
                                objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                                duration={16}
                                speed={8}
                                customSpeed={[8.0, 16.0]}
                            />
                            <VolumeParameterControls
                                object={ref}
                                colormap="jet"
                            />
                            <VolumeXYZClippingControls
                                object={ref}
                                planeSize={2}
                                areaSize={
                                    VOLUMEDATA.CArm_Configure.volume.areaSize
                                }
                                areaScale={1.1}
                                lineColor={new THREE.Color(0x6e0010)}
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
                                targets={[
                                    cArmAccumuRef,
                                    cArmRoll180Pitch360AccumuRef,
                                ]}
                            />

                            {/* -------------------------------------------------- */}
                            {/* Three.js Object */}
                            {/* Patient */}
                            <group
                                ref={patientRef}
                                position={
                                    VOLUMEDATA.CArm_Configure.object3d.patient
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_Configure.object3d.patient
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.CArm_Configure.object3d.patient
                                        .scale
                                }
                            >
                                <MODELS.XRay_Bed />
                                <MODELS.XRay_Patient />
                            </group>
                            {/* C Arm */}
                            <group
                                ref={cArmModelRef}
                                position={
                                    VOLUMEDATA.CArm_Configure.object3d.model
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_Configure.object3d.model
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.CArm_Configure.object3d.model
                                        .scale
                                }
                            >
                                <MODELS.CArmModel
                                    roll={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .roll
                                    }
                                    pitch={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .pitch
                                    }
                                    height={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .height
                                    }
                                />
                            </group>

                            <mesh position={[0, 1, 0]} visible={debug}>
                                <sphereBufferGeometry args={[0.25]} />
                            </mesh>

                            {/* Avatar */}
                            <PivotControls
                                matrix={new THREE.Matrix4().compose(
                                    new THREE.Vector3(1.5, 0, 0),
                                    new THREE.Quaternion().setFromEuler(
                                        new THREE.Euler(0, -Math.PI / 2, 0),
                                    ),
                                    new THREE.Vector3(1, 1, 1),
                                )}
                                scale={70}
                                fixed={true}
                                activeAxes={[true, false, true]}
                                visible={!viewing}
                                onDrag={(l, deltaL, w, deltaW) => {
                                    yBotRef.current.position.setFromMatrixPosition(
                                        w,
                                    );
                                    yBotRef.current.rotation.setFromRotationMatrix(
                                        w,
                                    );
                                }}
                                onDragEnd={() => {
                                    if (dosimeterRef.current) {
                                        dosimeterRef.current.updateResults();
                                    }

                                    set((state) => ({
                                        sceneProperties: {
                                            ...state.sceneProperties,
                                            executeLog: {
                                                ...state.sceneProperties
                                                    .executeLog,
                                                avatar: {
                                                    ...state.sceneProperties
                                                        .executeLog.avatar,
                                                    translate: true,
                                                },
                                            },
                                        },
                                    }));
                                }}
                            />
                            <group
                                ref={yBotRef}
                                position={[1.5, 0, 0]}
                                rotation={[0, -Math.PI / 2, 0]}
                            >
                                <CustomYBotIK />
                                <HandIKPivotControls
                                    object={yBotRef}
                                    scale={35}
                                    fixed={true}
                                />
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
                                    areaSize={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .areaSize
                                    }
                                    width={Board_Configure.size.x}
                                    height={Board_Configure.size.y}
                                    position={
                                        new THREE.Vector3(2.5, 1.25, -0.5)
                                    }
                                    rotation={
                                        new THREE.Euler(0, Math.PI / 2, 0)
                                    }
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
                        </Suspense>
                    </Canvas>
                    <Loader />
                    <SceneConfigPanel activateStats={false} />
                    <DoseEquipmentsUI />
                    <DosimeterUI nPerPatient={5e5} />
                    <ExperimentCheckList />
                </div>
            </div>
        </>
    );
}

export default CArmExtra;
