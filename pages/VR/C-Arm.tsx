import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PivotControls,
    Stats,
    Sky,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";
import {
    VRButton,
    XR,
    Interactive,
    Controllers,
    TeleportationPlane,
    useXR,
} from "@react-three/xr";
import { useControls, folder } from "leva";

// ==========
// Game
import {
    ControlPanel,
    // ----------
    // hook
    useToggle,
} from "../../components/game";

// ==========
// Model
import * as MODELS from "../../components/models";
import { Board_Configure } from "../../components/models";
import {
    CustomYBotIK,
    VRCustomYBotIK,
    SelfMadePlayer,
} from "../../components/models/Player";

// ==========
// Volume
// ----------
// object
import { Dosimeter, DoseGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as ENVIROMENT from "../../components/models/Environment";
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    DosePerspectiveToOrthographic,
    DoseAnimationControls,
    DoseBoardControls,
    DoseEquipmentsUI,
    DosimeterControls,
    DosimeterUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../components/volumeRender";
// FIXME:
import { DoseAnimationControlsWithAudio } from "../../components/volumeRender/controls/dose/DoseAnimationControlsWithAudio";
import { DoseAnimationControlsWithAudioUI } from "../../components/volumeRender/ui/DoseAnimationControlsWithAudioUI";

// ==========
// UI
import { ExperimentCheckList, SceneOptionsPanel } from "../../components/ui";

// ==========
// VR
import {
    VRDoseAnimationControls,
    VRVolumeParameterControls,
    VRDoseEquipmentsUI,
    VRDosimeterUI,
    VRPlayer,
    VRHandIKControls,
    VRSceneControls,
    VRUI,
} from "../../components/vr";

import { VRPanle, VRStats } from "components/vr";

// ==========
// Store
import { useStore } from "../../components/store";

// ==========
// Styles
import styles from "../../styles/threejs.module.css";

function XRayVR() {
    const [set, debug, follow, viewing, objectVisibles, executeLog] = useStore(
        (state) => [
            state.set,
            state.debug,
            state.follow,
            state.viewing,
            state.sceneStates.objectVisibles,
            state.sceneStates.executeLog,
        ]
    );

    const doseOriginPosition = new THREE.Vector3(
        VOLUMEDATA.CArm_Configure.doseOrigin.position[0],
        VOLUMEDATA.CArm_Configure.doseOrigin.position[1],
        VOLUMEDATA.CArm_Configure.doseOrigin.position[2] - 10
    );
    set((state) => ({
        sceneStates: { ...state.sceneStates, doseOrigin: doseOriginPosition },
    }));

    const names = [
        {
            name: "mixamorigLeftHandDosimeter",
            displayName: "Left Hand",
            category: "glove",
            coefficient: 0.1,
        },
        {
            name: "mixamorigRightHandDosimeter",
            displayName: "Right Hand",
            category: "glove",
            coefficient: 0.1,
        },
    ];
    const floorColor = "#8F8F96";

    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const cArmRef = useRef<DoseAnimationObject>(null);
    const cArmRoll180Pitch360Ref = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const cArmAccumuRef = useRef<DoseGroup>(null);
    const cArmRoll180Pitch360AccumuRef = useRef<DoseGroup>(null);

    const patientRef = useRef<THREE.Group>(null!);
    const cArmModelRef = useRef<THREE.Group>(null!);

    const originObjRef = useRef<THREE.Mesh>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

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

    const onChange = (e: number) => {
        const visibles = options.map((value, index) => index === e - 1);

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
                    config.model.height
                );
                if (patientRef.current) {
                    patientRef.current.position.set(...config.patient.position);
                    patientRef.current.rotation.set(...config.patient.rotation);
                    patientRef.current.scale.setScalar(config.patient.scale);
                }
            }
        });

        // set execute log for experiment
        const _cArm = executeLog.gimmick.cArm;
        _cArm[e] = true;

        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                executeLog: {
                    ...state.sceneStates.executeLog,
                    gimmick: {
                        ...state.sceneStates.executeLog.gimmick,
                        cArm: _cArm,
                    },
                },
            },
        }));
    };

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
    }, [ref]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    <VRButton />

                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas
                        // orthographic
                        camera={{
                            position: [4, 8, 4],
                            // zoom: 50
                        }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls />

                        {/* -------------------------------------------------- */}
                        {/* VR Canvas */}
                        <XR
                            onSessionStart={(event) => {
                                console.log(event);
                            }}
                        >
                            <TeleportationPlane
                                leftHand={true}
                                rightHand={true}
                            />
                            <Controllers rayMaterial={{ color: "#B30900" }} />

                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup
                                ref={ref}
                                position={[0, 0, -10]}
                            >
                                <doseGroup
                                    visible={objectVisibles.dose}
                                    position={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.volume.scale
                                    }
                                >
                                    {/* Time Lapse */}
                                    <doseGroup
                                        ref={timelapseRef}
                                        clim2={
                                            VOLUMEDATA.CArm_Configure.volume
                                                .clim2.timelapse
                                        }
                                        // clim2AutoUpdate={false}
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
                                            VOLUMEDATA.CArm_Configure.volume
                                                .clim2.accumulate
                                        }
                                        // clim2AutoUpdate={false}
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
                            </doseGroup>

                            {/* -------------------------------------------------- */}
                            {/* Volume Controls */}

                            {/* Dosimeter */}
                            <DosimeterControls
                                ref={dosimeterRef}
                                object={yBotRef}
                                names={names}
                                targets={[
                                    cArmAccumuRef,
                                    cArmRoll180Pitch360AccumuRef,
                                ]}
                            />

                            <group position={[0, 0, -10]}>
                                {/* -------------------------------------------------- */}
                                {/* Three.js Object */}
                                {/* Patient */}
                                <group
                                    ref={patientRef}
                                    position={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.scale
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
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.roll
                                        }
                                        pitch={
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.pitch
                                        }
                                        height={
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.height
                                        }
                                    />
                                </group>
                                <mesh
                                    ref={originObjRef}
                                    position={doseOriginPosition}
                                    scale={0.2}
                                    visible={debug}
                                >
                                    <sphereBufferGeometry args={[0.25]} />
                                </mesh>
                            </group>

                            {/* Player */}
                            <VRPlayer>
                                <group
                                    ref={yBotRef}
                                    visible={!follow}
                                >
                                    <SelfMadePlayer />
                                </group>
                            </VRPlayer>
                            <VRHandIKControls object={yBotRef} />

                            {/* -------------------------------------------------- */}
                            {/* Enviroment */}
                            <Sky sunPosition={[0, 1, 0]} />
                            <ambientLight intensity={0.5} />

                            {/* Floor */}
                            <mesh
                                name={"VRFloor"}
                                position={[0, -0.2, 0]}
                                rotation={[-Math.PI / 2, 0, 0]}
                            >
                                <planeGeometry args={[200, 200]} />
                                <meshStandardMaterial color={floorColor} />
                            </mesh>

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

                            {/* VR UI */}
                            <VRVolumeParameterControls
                                object={ref}
                                radius={4}
                                clim2={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .accumulate
                                    // VOLUMEDATA.CArm_Configure.volume.clim2
                                    //     .timelapse
                                }
                                cmin={0}
                                cmax={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .accumulate
                                }
                                climStep={
                                    VOLUMEDATA.CArm_Configure.volume.climStep
                                }
                            />

                            <VRUI>
                                <VRStats
                                    position={[-0.7, 2.05, -1]}
                                    rotation={[0.124, 0.196, -0.024]}
                                    scale={3}
                                />
                                <VRDosimeterUI
                                    position={[-0.7, 1.75, -1]}
                                    rotation={[0.124, 0.196, -0.024]}
                                    scale={4}
                                />
                                <VRDoseEquipmentsUI
                                    position={[-1.5, 1.6, -0.325]}
                                    rotation={[0, Math.PI / 2, 0]}
                                    scale={3}
                                />
                                <VRDoseAnimationControls
                                    position={[-1.45, 2.05, -0.325]}
                                    rotation={[
                                        Math.PI / 2,
                                        1.226,
                                        -Math.PI / 2,
                                    ]}
                                    scale={2.5}
                                    objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                    mainGroup={timelapseRef}
                                    subGroup={accumulateRef}
                                    duration={16}
                                    speed={8.0}
                                    customSpeed={[8.0, 16.0]}
                                />
                                <VRSceneControls
                                    position={[-1.4, 2.4, -0.325]}
                                    rotation={[
                                        Math.PI / 2,
                                        1.226,
                                        -Math.PI / 2,
                                    ]}
                                    scale={2.5}
                                    typeNum={2}
                                    onChange={onChange}
                                />
                            </VRUI>
                        </XR>
                    </Canvas>
                </div>

                <DosimeterUI
                    isXR
                    nPerPatient={5e5}
                />
            </div>
        </>
    );
}

export default XRayVR;
