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

// ==========
// Volume
// ----------
// object
import { DoseGroup, DoseAnimationObject } from "../../src";
// ----------
// data

import * as VOLUMEDATA from "../../../components/models/VolumeData";
// ----------
// controls
import {
    DoseAnimationControls,
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

function CArmBasic() {
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
                    <Canvas
                        orthographic
                        camera={{ position: [4, 8, 4], zoom: 50 }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}
                        <doseGroup
                            ref={ref}
                            position={VOLUMEDATA.CArm_Configure.volume.position}
                            rotation={VOLUMEDATA.CArm_Configure.volume.rotation}
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
                            customSpeed={[8.0, 16.0]}
                        />
                        <VolumeParameterControls object={ref} />
                        <VolumeXYZClippingControls
                            object={ref}
                            planeSize={2}
                            areaSize={VOLUMEDATA.CArm_Configure.volume.areaSize}
                            areaScale={1.1}
                            lineColor={new THREE.Color(0x6e0010)}
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
                                VOLUMEDATA.CArm_Configure.object3d.patient.scale
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
                                VOLUMEDATA.CArm_Configure.object3d.model.scale
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

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
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
                </div>
            </div>
        </>
    );
}

export default CArmBasic;
