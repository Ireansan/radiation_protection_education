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
    VRDosimeterControls,
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
        -0.182 + 0.4,
        1.15,
        -0.18 - 10
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

    const ref = useRef<DoseGroup>(null!);

    const timelapseRef = useRef<DoseGroup>(null);
    const nocurtainRef = useRef<DoseAnimationObject>(null);
    const nocurtain15x15Ref = useRef<DoseAnimationObject>(null);
    const curtainRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const nocurtainAccumuRef = useRef<DoseGroup>(null);
    const nocurtain15x15AccumuRef = useRef<DoseGroup>(null);
    const curtainAccumuRef = useRef<DoseGroup>(null);

    const curtainObjRef = useRef<THREE.Group>(null);

    const originObjRef = useRef<THREE.Mesh>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);

    const ToggledDebug = useToggle(Debug, "debug");

    const options = ["nocurtain", "nocurtain 15x15", "curtain"];
    const refs = [
        { time: nocurtainRef, accumu: nocurtainAccumuRef },
        { time: nocurtain15x15Ref, accumu: nocurtain15x15AccumuRef },
        { time: curtainRef, accumu: curtainAccumuRef, other: curtainObjRef },
    ];
    const onChange = (e: number) => {
        const visibles = options.map((value, index) => index === e - 1);

        visibles.forEach((value, index) => {
            let refTime = refs[index].time.current;
            refTime ? (refTime.visible = value) : null;
            let refAccumu = refs[index].accumu.current;
            refAccumu ? (refAccumu.visible = value) : null;
            let refOther = refs[index].other?.current;
            refOther ? (refOther.visible = value) : null;
        });

        // set execute log for experiment
        const _xRay = executeLog.gimmick.xRay;
        _xRay[e] = true;

        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                executeLog: {
                    ...state.sceneStates.executeLog,
                    gimmick: {
                        ...state.sceneStates.executeLog.gimmick,
                        xRay: _xRay,
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
                                rotation={[0, -Math.PI / 2, 0]}
                            >
                                <doseGroup
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
                                    {/* Time Lapse */}
                                    <doseGroup ref={timelapseRef}>
                                        {/* X-Ray Dose, no curtain */}
                                        <doseAnimationObject
                                            ref={nocurtainRef}
                                            name={"x-ray_animation_nocurtain"}
                                        >
                                            <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                        </doseAnimationObject>
                                        {/* X-Ray Dose, curtain */}
                                        <doseAnimationObject
                                            ref={curtainRef}
                                            name={"x-ray_animation_curtain"}
                                            visible={false}
                                        >
                                            <VOLUMEDATA.XRay_curtain_all_Animation />
                                        </doseAnimationObject>
                                    </doseGroup>

                                    {/* Accumulate */}
                                    <doseGroup
                                        ref={accumulateRef}
                                        visible={false}
                                    >
                                        {/* X-Ray Dose, no curtain, Accumulate */}
                                        <doseGroup
                                            ref={nocurtainAccumuRef}
                                            name={"x-ray_accumulate_nocurtain"}
                                        >
                                            <VOLUMEDATA.XRay_nocurtain_all_accumulate />
                                        </doseGroup>
                                        {/* X-Ray Dose, curtain, Accumulate */}
                                        <doseGroup
                                            ref={curtainAccumuRef}
                                            name={"x-ray_accumulate_curtain"}
                                            visible={false}
                                        >
                                            <VOLUMEDATA.XRay_curtain_all_accumulate />
                                        </doseGroup>
                                    </doseGroup>
                                </doseGroup>
                            </doseGroup>

                            {/* -------------------------------------------------- */}
                            {/* Volume Controls */}

                            {/* -------------------------------------------------- */}
                            <group
                                position={[0, 0, -10]}
                                rotation={[0, -Math.PI / 2, 0]}
                            >
                                {/* Three.js Object */}
                                <group
                                    position={
                                        ENVIROMENT.XRay_Configure.object3d
                                            .position
                                    }
                                    rotation={
                                        ENVIROMENT.XRay_Configure.object3d
                                            .rotation
                                    }
                                    scale={
                                        ENVIROMENT.XRay_Configure.object3d.scale
                                    }
                                >
                                    <ENVIROMENT.XRay_Bed />
                                    <ENVIROMENT.XRay_Machine />
                                    <ENVIROMENT.XRay_Patient />

                                    {/* Curtain (Three.js Object) */}
                                    <group
                                        ref={curtainObjRef}
                                        visible={false}
                                    >
                                        <ENVIROMENT.XRay_Curtain />
                                    </group>
                                </group>
                            </group>
                            <mesh
                                ref={originObjRef}
                                position={doseOriginPosition}
                                scale={0.2}
                                visible={debug}
                            >
                                <sphereBufferGeometry args={[0.25]} />
                            </mesh>

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
                            />

                            <VRUI>
                                {/* Front */}
                                <VRStats
                                    position={[-0.7, 2.25, -1]}
                                    rotation={[0.124, 0.196, -0.024]}
                                    scale={3}
                                />
                                <VRDosimeterControls
                                    ref={dosimeterRef}
                                    object={yBotRef}
                                    names={names}
                                    targets={[
                                        nocurtainAccumuRef,
                                        nocurtain15x15AccumuRef,
                                        curtainAccumuRef,
                                    ]}
                                    position={[-0.7, 1.75, -1]}
                                    rotation={[0.124, 0.196, -0.024]}
                                    scale={3}
                                />

                                {/* Right */}
                                <VRSceneControls
                                    position={[1.15, 1.95, -0.315]}
                                    rotation={[0, -Math.PI / 2, 0]}
                                    scale={3}
                                    typeNum={3}
                                    onChange={onChange}
                                />
                                <VRDoseEquipmentsUI
                                    position={[1.15, 1.6, -0.315]}
                                    rotation={[0, -Math.PI / 2, 0]}
                                    scale={3}
                                />

                                {/* Left */}
                                <VRDoseAnimationControls
                                    position={[-1.15, 1.6, -0.315]}
                                    rotation={[0, Math.PI / 2, 0]}
                                    scale={3}
                                    objects={[
                                        nocurtainRef,
                                        nocurtain15x15Ref,
                                        curtainRef,
                                    ]}
                                    mainGroup={timelapseRef}
                                    subGroup={accumulateRef}
                                    duration={16}
                                    speed={8.0}
                                    customSpeed={[8.0, 16.0]}
                                />
                            </VRUI>
                        </XR>
                    </Canvas>
                </div>

                <DosimeterUI isXR />
                <SceneOptionsPanel />
            </div>
        </>
    );
}

export default XRayVR;
