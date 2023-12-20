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
    DoseBoardControls,
    DoseEquipmentsUI,
    DosimeterControls,
    DosimeterUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../../components/volumeRender";

// FIXME:
import { PrototypeAnimationControls } from "../../../components/volumeRender/controls/dose/PrototypeAnimationControls";
import { PrototypeAnimationControlsUI } from "../../../components/volumeRender/ui/PrototypeAnimationControlsUI";

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
import { Exercise } from "../../../components/ui/exercise";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Utils
import { applyBasePath } from "../../../utils";

// ==========
// Styles
import styles from "../../../styles/threejs.module.css";

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
                params: { type: "experiment" },
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
    const isExperiment = pageType === "experiment";
    const isPerspective = pageType === "perspective";

    return {
        props: {
            availables: {
                orthographic: !isPerspective,
                player: isExtra || isExperiment || isPerspective,
                shield: isExtra || isExperiment || isPerspective,
                dosimeter: isExtra || isExperiment || isPerspective,
                experimentUI: isExperiment,
            },
        },
    };
};

function VisualizationCArm({ ...props }: PageProps) {
    const [set, debug, viewing, objectVisibles] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
        state.sceneStates.objectVisibles,
    ]);

    const doseOriginPosition = new THREE.Vector3(-0.182, 1.15, -0.18);
    set((state) => ({
        sceneStates: { ...state.sceneStates, doseOrigin: doseOriginPosition },
    }));
    const audioPath = `/models/nrrd/c-arm/animation/c-arm.mp3`;
    const names = [
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
    ];

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
                                    config.model.height
                                );
                                if (patientRef.current) {
                                    patientRef.current.position.set(
                                        ...config.patient.position
                                    );
                                    patientRef.current.rotation.set(
                                        ...config.patient.rotation
                                    );
                                    patientRef.current.scale.setScalar(
                                        config.patient.scale
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
                    <Suspense fallback={null}>
                        <Canvas
                            orthographic={props.availables.orthographic}
                            camera={{
                                position: [4, 8, 4],
                                zoom: props.availables.orthographic ? 75 : 1.0,
                            }}
                        >
                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup
                                ref={ref}
                                visible={objectVisibles.dose}
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
                                        VOLUMEDATA.CArm_Configure.volume.clim2
                                            .accumulate
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

                            {/* -------------------------------------------------- */}
                            {/* Volume Controls */}
                            {/* <DoseAnimationControls
                                objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                                duration={16}
                                speed={8}
                                customSpeed={[8.0, 16.0]}
                            /> */}
                            <PrototypeAnimationControls
                                audioRef={audioRef}
                                objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                            />
                            <VolumeParameterControls
                                object={ref}
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
                            {props.availables.dosimeter ? (
                                <>
                                    <DosimeterControls
                                        ref={dosimeterRef}
                                        object={yBotRef}
                                        names={names}
                                        targets={[
                                            cArmAccumuRef,
                                            cArmRoll180Pitch360AccumuRef,
                                        ]}
                                    />
                                </>
                            ) : null}

                            {/* -------------------------------------------------- */}
                            {/* Three.js Object */}
                            <group visible={objectVisibles.object3d}>
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
                            </group>
                            <mesh
                                ref={originObjRef}
                                position={doseOriginPosition}
                                scale={0.2}
                                visible={debug}
                            >
                                <sphereBufferGeometry args={[0.25]} />
                            </mesh>

                            {/* Avatar */}
                            {props.availables.player ? (
                                <>
                                    <PlayerPivotControls
                                        playerRef={yBotRef}
                                        dosimeterRef={dosimeterRef}
                                        matrix={new THREE.Matrix4().compose(
                                            new THREE.Vector3(1.5, 0, 0),
                                            new THREE.Quaternion().setFromEuler(
                                                new THREE.Euler(
                                                    0,
                                                    -Math.PI / 2,
                                                    0
                                                )
                                            ),
                                            new THREE.Vector3(1, 1, 1)
                                        )}
                                        scale={70}
                                        fixed={true}
                                        activeAxes={[true, false, true]}
                                    />
                                    <group
                                        ref={yBotRef}
                                        visible={objectVisibles.player}
                                        position={[1.5, 0, 0]}
                                        rotation={[0, -Math.PI / 2, 0]}
                                    >
                                        <CustomYBotIK />
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
                            {/* Three.js Controls */}
                            <CustomOrbitControls />

                            {/* -------------------------------------------------- */}
                            {/* Physics */}
                            <Physics gravity={[0, -30, 0]}>
                                <ToggledDebug />

                                {/* Dose Board */}
                                {props.availables.shield ? (
                                    <>
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
                                            scale={50}
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
                    </Suspense>
                    <Loader />
                    <SceneOptionsPanel activateStats={false} />

                    <audio
                        src={applyBasePath(audioPath)}
                        ref={audioRef}
                        muted={true}
                    />
                    <PrototypeAnimationControlsUI
                        audioRef={audioRef}
                        duration={16}
                        speed={8.0}
                        customSpeed={[8.0, 16.0]}
                    />

                    {objectVisibles.dosimeterUI &&
                    props.availables.dosimeter ? (
                        <>
                            <DoseEquipmentsUI />
                            <DosimeterUI nPerPatient={5e5} />
                        </>
                    ) : null}
                    {objectVisibles.experimentUI &&
                    props.availables.experimentUI ? (
                        <>
                            <ExperimentCheckList />
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default VisualizationCArm;
