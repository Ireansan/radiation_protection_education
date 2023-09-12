import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Leva } from "leva";

// ==========
// Game
import {
    // ----------
    // controls
    Keyboard,
    // ----------
    // prefab
    Ground,
    Player,
    YBot,
    // ----------
    // ui
    ControlPanel,
    Editor,
    Help,
    Menu,
    // ----------
    // hook
    useToggle,
} from "../../components/game";

// ==========
// Volume
// ----------
// object
import { Dosimeter, VolumeGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    DoseBoardControls,
    DosimeterControls,
    DosimeterDisplayUI,
    VolumeAnimationControls,
    VolumeParameterControls,
    VolumeClippingControls,
} from "../../components/volumeRender";

// ==========
// Store
import { useStore } from "../../components/store";

import styles from "../../styles/css/game.module.css";

function XRayRoomGame() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null);

    const xOffset: number = -5;
    const zOffset: number = 0;

    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    const ToggledStats = useToggle(Stats, "stats");

    const [menu, set] = useStore((state) => [state.menu, state.set]);
    const editor = useStore((state) => state.editor);

    return (
        <>
            <div className={styles.root}>
                <div
                    className={`${styles.fullscreen}
                    ${menu && `${styles.clicked}`}`}
                >
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas shadows camera={{ fov: 45 }} id={"mainCanvas"}>
                        {/* -------------------------------------------------- */}
                        {/* Volume Objects */}
                        <volumeGroup ref={ref} position={[xOffset, 0, zOffset]}>
                            {/* Dose */}
                            <doseAnimationObject
                                ref={refAnimation}
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
                                boardCoefficient={0.01}
                            >
                                <VOLUMEDATA.XRay_nocurtain_all_Animation />
                            </doseAnimationObject>
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
                            folderName="Dose"
                            normals={[
                                [0, 0, -1],
                                // [-1, 0, 0],
                            ]}
                        />

                        <DosimeterControls
                            ref={dosimeterRef}
                            object={yBotRef}
                            names={[
                                { name: "mixamorigNeck", displayName: "Neck" },
                                {
                                    name: "mixamorigLeftHand",
                                    displayName: "Left Hand",
                                },
                                {
                                    name: "mixamorigRightHand",
                                    displayName: "Right Hand",
                                },
                            ]}
                            targets={[refAnimation]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group position={[xOffset, 0, zOffset]}>
                            <group
                                position={
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.XRay_nocurtain_Configure.volume
                                        .scale *
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .scale
                                }
                            >
                                <VOLUMEDATA.XRay_nocurtain_material />
                                <VOLUMEDATA.XRay_nocurtain_region />
                            </group>
                        </group>
                        <ControlPanel position={[0, 2, -5]} />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            <Ground />
                            {/* Player */}
                            <Player>
                                <group ref={yBotRef}>
                                    <YBot />
                                </group>
                            </Player>

                            {/* Dose Board */}
                            <DoseBoardControls
                                object={refAnimation}
                                origin={new THREE.Vector3(xOffset, 1, zOffset)}
                                areaSize={[2.2, 1.2, 3.1]}
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
                        </Physics>

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <Sky sunPosition={[100, 20, 100]} />
                        <ambientLight intensity={0.3} />
                        <pointLight
                            castShadow
                            intensity={0.8}
                            position={[100, 100, 100]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Player Contorls */}
                        <Keyboard />
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI */}
                    <Help />
                    <Leva />
                    <DosimeterDisplayUI />
                </div>

                <Menu />
                <ToggledStats />
                <ToggledEditor />
            </div>
        </>
    );
}

export default XRayRoomGame;
