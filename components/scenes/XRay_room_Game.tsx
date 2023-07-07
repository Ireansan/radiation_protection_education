import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Leva } from "leva";

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
    useStore,
    useToggle,
} from "../game";
import { VolumeGroup, VolumeAnimationObject } from "../../src";
import {
    VolumeAnimationControls,
    VolumeParameterControls,
    VolumeClippingControls,
} from "../volumeRender";
import * as VOLUMEDATA from "../models/VolumeData";

import styles from "../../styles/css/game.module.css";

function XRayRoomGame() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);

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
                            <volumeAnimationObject
                                ref={refAnimation}
                                position={
                                    VOLUMEDATA.Dose_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.Dose_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.Dose_Configure.volume.scale}
                            >
                                <VOLUMEDATA.Dose_all_Animation />
                            </volumeAnimationObject>
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
                            folderName="Stent"
                            normals={[
                                [0, 0, -1],
                                // [-1, 0, 0],
                            ]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group position={[xOffset, 0, zOffset]}>
                            <group
                                position={
                                    VOLUMEDATA.Dose_Configure.object3d.position
                                }
                                rotation={
                                    VOLUMEDATA.Dose_Configure.object3d.rotation
                                }
                                scale={
                                    VOLUMEDATA.Dose_Configure.volume.scale *
                                    VOLUMEDATA.Dose_Configure.object3d.scale
                                }
                            >
                                <VOLUMEDATA.Dose_material />
                                <VOLUMEDATA.Dose_region />
                            </group>
                        </group>
                        <ControlPanel position={[0, 2, -5]} />

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
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            <Ground />
                            <Player>
                                <YBot />
                            </Player>
                        </Physics>

                        {/* -------------------------------------------------- */}
                        {/* Player Contorls */}
                        <Keyboard />
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI */}
                    <Help />
                    <Leva />
                </div>

                <Menu />
                <ToggledStats />
                <ToggledEditor />
            </div>
        </>
    );
}

export default XRayRoomGame;
