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
import * as ENVIROMENT from "../../../components/models/Environment";
import * as VOLUMEDATA from "../../../components/models/VolumeData";
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
} from "../../../components/volumeRender";

// ==========
// UI
import { ExperimentCheckList, SceneConfigPanel } from "../../../components/ui";

// ==========
// VR
import {
    VRDoseAnimationControls,
    VRVolumeParameterControls,
    VRDoseEquipmentsUI,
} from "../../../components/vr";

import { VRPanle, VRStats } from "components/vr";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Styles
import styles from "../../../styles/threejs.module.css";
import { VRDosimeterUI } from "components/vr/ui/VRDosimeterUI";

function XRInit() {
    const { isPresenting, player } = useXR();

    useEffect(() => {
        if (isPresenting) {
            player.position.x = 4;
            player.position.y = 1;
            player.position.z = 4;
        }
    }, [isPresenting]);

    return <></>;
}

function XRayVR() {
    const [set, debug, viewing] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
    ]);

    const ref = useRef<DoseGroup>(null!);

    const timelapseRef = useRef<DoseGroup>(null);
    const nocurtainRef = useRef<DoseAnimationObject>(null);
    const curtainRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const nocurtainAccumuRef = useRef<DoseGroup>(null);
    const curtainAccumuRef = useRef<DoseGroup>(null);

    const curtainObjRef = useRef<THREE.Group>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);

    const ToggledDebug = useToggle(Debug, "debug");

    const [,] = useControls(() => ({
        Scene: folder({
            Gimmick: folder({
                curtain: {
                    value: false,
                    onChange: (e) => {
                        nocurtainRef.current
                            ? (nocurtainRef.current.visible = !e)
                            : null;
                        nocurtainAccumuRef.current
                            ? (nocurtainAccumuRef.current.visible = !e)
                            : null;

                        curtainRef.current
                            ? (curtainRef.current.visible = e)
                            : null;
                        curtainAccumuRef.current
                            ? (curtainAccumuRef.current.visible = e)
                            : null;
                        curtainObjRef.current
                            ? (curtainObjRef.current.visible = e)
                            : null;
                    },
                },
            }),
        }),
    }));

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
                        <XR>
                            <TeleportationPlane
                                leftHand={true}
                                rightHand={true}
                            />
                            <Controllers />

                            <DosePerspectiveToOrthographic
                                object={ref}
                                zoom={450}
                            />

                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup ref={ref} position={[0, 0, -10]}>
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

                            <VolumeXYZClippingControls
                                object={ref}
                                planeSize={2}
                                areaSize={
                                    VOLUMEDATA.XRay_curtain_Configure.volume
                                        .areaSize
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
                                targets={[nocurtainAccumuRef, curtainAccumuRef]}
                            />

                            <group position={[0, 0, -10]}>
                                {/* -------------------------------------------------- */}
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
                                    <group ref={curtainObjRef} visible={false}>
                                        <ENVIROMENT.XRay_Curtain />
                                    </group>
                                </group>
                                <mesh position={[0, 1, 0]} visible={debug}>
                                    <sphereBufferGeometry args={[0.25]} />
                                </mesh>

                                {/* Avatar */}
                                <PivotControls
                                    matrix={new THREE.Matrix4().compose(
                                        new THREE.Vector3(2, 0, 0),
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
                                    position={[2, 0, 0]}
                                    rotation={[0, -Math.PI / 2, 0]}
                                >
                                    <CustomYBotIK />
                                    {/* <HandIKPivotControls object={yBotRef} scale={35} fixed={true}/> */}
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
                                            VOLUMEDATA.XRay_curtain_Configure
                                                .volume.areaSize
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
                                                color={
                                                    new THREE.Color(0xb39a7b)
                                                }
                                            />
                                        </mesh>
                                    </DoseBoardControls>
                                </Physics>
                            </group>

                            {/* -------------------------------------------------- */}
                            {/* Enviroment */}
                            <Sky sunPosition={[0, 1, 0]} />
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

                            <group
                                position={[2, 0, -9]}
                                rotation={[0, Math.PI, 0]}
                            >
                                <VRStats position={[-0.75, 2, 0]} scale={3} />

                                <group position={[0, 1.5, 0]} scale={3}>
                                    <VRDoseAnimationControls
                                        // position={[-0.325, 0, 0.1]}
                                        // rotation={[0, Math.PI / 6, 0]}
                                        position={[-0.325, 0, 0]}
                                        objects={[nocurtainRef, curtainRef]}
                                        mainGroup={timelapseRef}
                                        subGroup={accumulateRef}
                                        duration={16}
                                        customSpeed={[8.0, 16.0]}
                                    />
                                    <VRVolumeParameterControls
                                        position={[0, 0, 0]}
                                        object={ref}
                                    />
                                </group>
                                <group position={[-3, 1.5, 0]} scale={3}>
                                    <VRDosimeterUI position={[0, 0, 0]} />
                                    <VRDoseEquipmentsUI
                                        position={[0.325, 0, 0]}
                                    />
                                </group>
                            </group>
                        </XR>
                    </Canvas>
                </div>
                <DosimeterUI />
            </div>
        </>
    );
}

export default XRayVR;
