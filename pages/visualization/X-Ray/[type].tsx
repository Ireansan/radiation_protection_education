import {
    GetStaticPaths,
    GetStaticProps,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from "next";
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
    // hook
    useToggle,
} from "../../../components/game";

// ==========
// Model
import { Board_Configure } from "../../../components/models";
import {
    CustomYBotIK,
    SelfMadePlayer,
} from "../../../components/models/Player";
import {
    HandIKLevaControls,
    HandIKPivotControls,
    PlayerPivotControls,
} from "../../../components/models/controls";

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
    DoseAnimationControls,
    DoseAnimationControlsWithAudio,
    DoseAnimationControlsWithAudioUI,
    DoseBoardControls,
    DoseEquipmentsUI,
    DosimeterControls,
    DosimeterUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../../components/volumeRender";

// ==========
// Controls
import { CustomOrbitControls } from "../../../components/controls";

// ==========
// UI
import {
    CoordHTML,
    ExperimentCheckList,
    SceneOptionsPanel,
} from "../../../components/ui";
import { Tips } from "../../../components/ui/tips";
import { Exercise, Tutorial } from "../../../components/ui/exercise";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Utils
import { applyBasePath } from "../../../utils";

// ==========
// Styles
import styles from "../../../styles/css/threejs.module.css";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { type: "basic" },
            },
            {
                params: { type: "extra" },
            },
            {
                params: { type: "tutorial" },
            },
            {
                params: { type: "tutorial_en" },
            },
            {
                params: { type: "exercise" },
            },
            {
                params: { type: "exercise_en" },
            },
            {
                params: { type: "perspective" },
            },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const pageType = params!.type;

    const isBasic = pageType === "basic";
    const isExtra = pageType === "extra";
    const isTutorial = pageType === "tutorial" || pageType === "tutorial_en";
    const isExercise = pageType === "exercise" || pageType === "exercise_en";
    const isPerspective = pageType === "perspective";
    const isEnglish = pageType === "tutorial_en" || pageType === "exercise_en";

    return {
        props: {
            availables: {
                orthographic: !isPerspective,
                player: isExtra || isTutorial || isExercise || isPerspective,
                shield: isExtra || isTutorial || isExercise || isPerspective,
                dosimeter: isExtra || isTutorial || isExercise || isPerspective,
                experimentUI: isExercise,
                exerciseUI: isExtra || isExercise || isPerspective,
                tutorialUI: isTutorial,
            },
            isEnglish: isEnglish,
        },
    };
};

function VisualizationXRay({ ...props }: PageProps) {
    const [set, debug, viewing, objectVisibles, executeLog] = useStore(
        (state) => [
            state.set,
            state.debug,
            state.viewing,
            state.sceneStates.objectVisibles,
            state.sceneStates.executeLog,
        ]
    );

    const doseOriginPosition = new THREE.Vector3(-0.182, 1.15, -0.18);
    set((state) => ({
        sceneStates: { ...state.sceneStates, doseOrigin: doseOriginPosition },
    }));

    const audioPath = `/models/nrrd/x-ray/nocurtain_animation/x-ray_nocurtain.mp3`;
    const names = [
        {
            name: "mixamorigLeftEyeDosimeter",
            displayName: "Left Eye",
            category: "goggle",
            coefficient: 0.1,
        },
        {
            name: "mixamorigRightEyeDosimeter",
            displayName: "Right Eye",
            category: "goggle",
            coefficient: 0.1,
        },
        {
            name: "mixamorigNeckDosimeter",
            displayName: "Neck",
            category: "neck",
            coefficient: 0.1,
        },
        {
            name: "mixamorigSpine1Dosimeter",
            displayName: "Chest",
            category: "apron",
            coefficient: 0.1,
        },
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

    const ref = useRef<DoseGroup>(null!);

    const timelapseRef = useRef<DoseGroup>(null);
    const nocurtainRef = useRef<DoseAnimationObject>(null);
    const nocurtain15x15Ref = useRef<DoseAnimationObject>(null);
    const curtainRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const nocurtainAccumuRef = useRef<DoseGroup>(null);
    const nocurtain15x15AccumuRef = useRef<DoseGroup>(null);
    const curtainAccumuRef = useRef<DoseGroup>(null);

    const originObjRef = useRef<THREE.Mesh>(null);
    const curtainObjRef = useRef<THREE.Group>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const options = ["nocurtain", "nocurtain 15x15", "curtain"];
    const refs = [
        { time: nocurtainRef, accumu: nocurtainAccumuRef },
        { time: nocurtain15x15Ref, accumu: nocurtain15x15AccumuRef },
        { time: curtainRef, accumu: curtainAccumuRef, other: curtainObjRef },
    ];
    const [,] = useControls(() => ({
        Scene: folder({
            Gimmick: folder({
                type: {
                    options: options,
                    value: options[0],
                    onChange: (e) => {
                        const visibles = options.map((value) => value === e);

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
                    },
                },
            }),
        }),
    }));

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
                        orthographic={props.availables.orthographic}
                        camera={{
                            position: [4, 8, 4],
                            zoom: props.availables.orthographic ? 90 : 1.0,
                        }}
                    >
                        <Suspense fallback={null}>
                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup
                                ref={ref}
                                visible={objectVisibles.dose}
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
                            >
                                {/* ========================= */}
                                {/* Time Lapse */}
                                <doseGroup ref={timelapseRef}>
                                    {/* ------------------------- */}
                                    {/* X-Ray Dose, no curtain */}
                                    <doseAnimationObject
                                        ref={nocurtainRef}
                                        name={"x-ray_animation_nocurtain"}
                                    >
                                        <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                    </doseAnimationObject>

                                    {/* ------------------------- */}
                                    {/* X-Ray Dose, no curtain 15x15 */}
                                    <doseAnimationObject
                                        ref={nocurtain15x15Ref}
                                        name={"x-ray_animation_nocurtain_15x15"}
                                        position={
                                            VOLUMEDATA
                                                .XRay_nocurtain_15x15_Configure
                                                .volume.local.position
                                        }
                                        scale={
                                            VOLUMEDATA
                                                .XRay_nocurtain_15x15_Configure
                                                .volume.local.scale
                                        }
                                        visible={false}
                                    >
                                        <VOLUMEDATA.XRay_nocurtain_15x15_all_Animation />
                                    </doseAnimationObject>

                                    {/* ------------------------- */}
                                    {/* X-Ray Dose, curtain */}
                                    <doseAnimationObject
                                        ref={curtainRef}
                                        name={"x-ray_animation_curtain"}
                                        visible={false}
                                    >
                                        <VOLUMEDATA.XRay_curtain_all_Animation />
                                    </doseAnimationObject>
                                </doseGroup>

                                {/* ========================= */}
                                {/* Accumulate */}
                                <doseGroup
                                    ref={accumulateRef}
                                    visible={false}
                                >
                                    {/* ------------------------- */}
                                    {/* X-Ray Dose, no curtain, Accumulate */}
                                    <doseGroup
                                        ref={nocurtainAccumuRef}
                                        name={"x-ray_accumulate_nocurtain"}
                                    >
                                        <VOLUMEDATA.XRay_nocurtain_all_accumulate />
                                    </doseGroup>

                                    {/* ------------------------- */}
                                    {/* X-Ray Dose, no curtain 15x15, Accumulate */}
                                    <doseGroup
                                        ref={nocurtain15x15AccumuRef}
                                        name={
                                            "x-ray_accumulate_nocurtain_15x15"
                                        }
                                        position={
                                            VOLUMEDATA
                                                .XRay_nocurtain_15x15_Configure
                                                .volume.local.position
                                        }
                                        scale={
                                            VOLUMEDATA
                                                .XRay_nocurtain_15x15_Configure
                                                .volume.local.scale
                                        }
                                        visible={false}
                                    >
                                        <VOLUMEDATA.XRay_nocurtain_15x15_all_accumulate />
                                    </doseGroup>

                                    {/* ------------------------- */}
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

                            {/* -------------------------------------------------- */}
                            {/* Three.js Object */}
                            {/* ========================= */}
                            {/* Machine & Patient */}
                            <group
                                visible={objectVisibles.object3d}
                                position={
                                    ENVIROMENT.XRay_Configure.object3d.position
                                }
                                rotation={
                                    ENVIROMENT.XRay_Configure.object3d.rotation
                                }
                                scale={ENVIROMENT.XRay_Configure.object3d.scale}
                            >
                                {/* ------------------------- */}
                                {/* Patient */}
                                <ENVIROMENT.XRay_Bed />
                                <ENVIROMENT.XRay_Patient />

                                {/* ------------------------- */}
                                {/* X-Ray machine */}
                                <ENVIROMENT.XRay_Machine />

                                {/* ------------------------- */}
                                {/* Curtain */}
                                <group
                                    ref={curtainObjRef}
                                    visible={false}
                                >
                                    <ENVIROMENT.XRay_Curtain />
                                </group>
                            </group>

                            {/* ========================= */}
                            {/* Dose Origin */}
                            <mesh
                                ref={originObjRef}
                                position={doseOriginPosition}
                                scale={0.2}
                                visible={debug}
                            >
                                <sphereBufferGeometry args={[0.25]} />
                            </mesh>

                            {/* ========================= */}
                            {/* Avatar */}
                            {props.availables.player ? (
                                <>
                                    <PlayerPivotControls
                                        playerRef={yBotRef}
                                        dosimeterRef={dosimeterRef}
                                        position={new THREE.Vector3(2, 0, 0)}
                                        rotation={
                                            new THREE.Euler(0, -Math.PI / 2, 0)
                                        }
                                        scale={70}
                                        fixed={true}
                                        activeAxes={[true, false, true]}
                                    />
                                    <group
                                        ref={yBotRef}
                                        visible={objectVisibles.player}
                                        position={[2, 0, 0]}
                                        rotation={[0, -Math.PI / 2, 0]}
                                        onPointerOver={(e) =>
                                            console.log("Player", e)
                                        }
                                    >
                                        <SelfMadePlayer />
                                        {/* <CustomYBotIK /> */}
                                        {/* <HandIKPivotControls
                                            object={yBotRef}
                                            scale={35}
                                            fixed={true}
                                            visible={
                                                objectVisibles.playerHandPivot
                                            }
                                        /> */}
                                        <HandIKLevaControls object={yBotRef} />
                                        <CoordHTML
                                            origin={originObjRef}
                                            enableRotation={false}
                                            xzPlane={true}
                                        />
                                    </group>
                                </>
                            ) : null}

                            {/* -------------------------------------------------- */}
                            {/* Physics */}
                            <Physics gravity={[0, -30, 0]}>
                                <ToggledDebug />

                                {/* ========================= */}
                                {/* Shield */}
                                {props.availables.shield ? (
                                    <>
                                        <DoseBoardControls
                                            object={ref}
                                            origin={new THREE.Vector3(0, 1, 0)}
                                            areaSize={
                                                VOLUMEDATA
                                                    .XRay_curtain_Configure
                                                    .volume.areaSize
                                            }
                                            width={Board_Configure.size.x}
                                            height={Board_Configure.size.y}
                                            position={
                                                new THREE.Vector3(
                                                    2.5,
                                                    1.25,
                                                    -0.5
                                                )
                                            }
                                            rotation={
                                                new THREE.Euler(
                                                    0,
                                                    Math.PI / 2,
                                                    0
                                                )
                                            }
                                            planeSize={Board_Configure.size.y}
                                            scale={60}
                                            fixed={true}
                                            offset={[0, 0, 0.1]}
                                            opacity={0.75}
                                            visible={
                                                objectVisibles.shield &&
                                                objectVisibles.shieldPivot
                                            }
                                        >
                                            <group>
                                                <mesh
                                                    visible={
                                                        objectVisibles.shield
                                                    }
                                                    position={[0, 0, 0]}
                                                    onPointerOver={(e) =>
                                                        console.log("Board", e)
                                                    }
                                                >
                                                    <boxBufferGeometry
                                                        args={[
                                                            ...Board_Configure.size.toArray(),
                                                        ]}
                                                    />
                                                    <meshBasicMaterial
                                                        color={
                                                            new THREE.Color(
                                                                0xb39a7b
                                                            )
                                                        }
                                                    />
                                                </mesh>
                                                <CoordHTML
                                                    origin={originObjRef}
                                                    enableDistance={false}
                                                />
                                            </group>
                                        </DoseBoardControls>
                                    </>
                                ) : null}
                            </Physics>

                            {/* -------------------------------------------------- */}
                            {/* Controls */}
                            {/* ========================= */}
                            {/* Volume Controls */}
                            {/* ------------------------- */}
                            {/* Animation Controls */}
                            {/* <DoseAnimationControls
                                objects={[nocurtainRef, curtainRef]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                                duration={16}
                                speed={8.0}
                                customSpeed={[8.0, 16.0]}
                            /> */}
                            <DoseAnimationControlsWithAudio
                                audioRef={audioRef}
                                objects={[
                                    nocurtainRef,
                                    nocurtain15x15Ref,
                                    curtainRef,
                                ]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                            />

                            {/* ------------------------- */}
                            {/* Parameter Controls */}
                            <VolumeParameterControls object={ref} />

                            {/* ------------------------- */}
                            {/* Clipping Controls */}
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

                            {/* ------------------------- */}
                            {/* Dosimeter */}
                            {props.availables.dosimeter ? (
                                <>
                                    <DosimeterControls
                                        ref={dosimeterRef}
                                        object={yBotRef}
                                        names={names}
                                        targets={[
                                            nocurtainAccumuRef,
                                            nocurtain15x15AccumuRef,
                                            curtainAccumuRef,
                                        ]}
                                    />
                                </>
                            ) : null}

                            {/* ========================= */}
                            {/* Three.js Controls */}
                            <CustomOrbitControls />

                            {/* -------------------------------------------------- */}
                            {/* Enviroment */}
                            <ambientLight intensity={0.5} />

                            <Grid
                                position={[0, -0.01, 0]}
                                args={[10.5, 10.5]}
                                visible={objectVisibles.grid}
                                cellColor={"#121d7d"}
                                sectionColor={"#262640"}
                                fadeDistance={20}
                                followCamera
                                infiniteGrid
                                matrixWorldAutoUpdate={undefined}
                                getObjectsByProperty={undefined}
                                getVertexPosition={undefined}
                            />

                            {/* -------------------------------------------------- */}
                            {/* UI (three.js) */}
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
                                    visible={objectVisibles.gizmo}
                                />
                            </GizmoHelper>
                        </Suspense>
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI */}
                    <Loader />

                    {/* -------------------------------------------------- */}
                    {/* Scene Options Controls UI */}
                    <SceneOptionsPanel activateStats={false} />

                    {/* -------------------------------------------------- */}
                    {/* Tips */}
                    <Tips isEnglish={props.isEnglish} />

                    {/* -------------------------------------------------- */}
                    {/* Animation Controls UI */}
                    <audio
                        src={applyBasePath(audioPath)}
                        ref={audioRef}
                        muted={true}
                    />
                    <DoseAnimationControlsWithAudioUI
                        audioRef={audioRef}
                        duration={16}
                        speed={8.0}
                        customSpeed={[8.0, 16.0]}
                    />

                    {/* -------------------------------------------------- */}
                    {/* Dosimeter UI */}
                    <div
                        className={`${
                            (!props.availables.dosimeter ||
                                !objectVisibles.dosimeterUI) &&
                            `${styles.isTransparent}`
                        }`}
                    >
                        <DoseEquipmentsUI />
                        <DosimeterUI />
                    </div>

                    {/* -------------------------------------------------- */}
                    {/* Scenario UI */}
                    <div
                        className={`${
                            !objectVisibles.scenarioUI &&
                            `${styles.isTransparent}`
                        }`}
                    >
                        {props.availables.exerciseUI ? (
                            <>
                                <Exercise
                                    sceneName="X-Ray"
                                    isEnglish={props.isEnglish}
                                />
                            </>
                        ) : null}
                        {props.availables.tutorialUI ? (
                            <>
                                <Tutorial
                                    sceneName="X-Ray"
                                    isEnglish={props.isEnglish}
                                />
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

export default VisualizationXRay;
