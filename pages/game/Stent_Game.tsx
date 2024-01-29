import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    Sky,
    Stats,
} from "@react-three/drei";
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
    ControlPanel,
    Ground,
    Player,
    YBot,
    // ----------
    // ui
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
import { VolumeGroup } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../components/volumeRender";

// ==========
// Store
import { useStore } from "../../components/store";

// ==========
// Styles
import styles from "../../styles/css/game.module.css";

function StentGame() {
    const [menu, set] = useStore((state) => [state.menu, state.set]);
    const editor = useStore((state) => state.editor);

    const ref = React.useRef<VolumeGroup>(null!);

    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    const ToggledStats = useToggle(Stats, "stats");

    return (
        <>
            <div className={styles.root}>
                <div
                    className={`${styles.fullscreen}
                    ${menu && `${styles.clicked}`}`}
                >
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas
                        shadows
                        camera={{ fov: 45 }}
                        id={"mainCanvas"}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}
                        {/* ========================= */}
                        {/* Stent */}
                        <volumeGroup ref={ref}>
                            <VOLUMEDATA.Stent
                                position={[-5, 1, -4]}
                                rotation={
                                    VOLUMEDATA.Stent_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.Stent_Configure.volume.scale}
                            />
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeParameterControls object={ref} />
                        <VolumeXYZClippingControls object={ref} />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <ControlPanel position={[0, 2, -5]} />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            <Ground />

                            {/* ========================= */}
                            {/* Player */}
                            <Player>
                                <YBot />
                            </Player>
                        </Physics>

                        {/* -------------------------------------------------- */}
                        {/* Controls */}
                        {/* ========================= */}
                        {/* Volume Controls */}
                        {/* ------------------------- */}
                        {/* Parameter Controls */}
                        <VolumeParameterControls object={ref} />

                        {/* ------------------------- */}
                        {/* Clipping Controls */}
                        <VolumeXYZClippingControls object={ref} />

                        {/* ========================= */}
                        {/* Player Contorls */}
                        <Keyboard />

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <Sky sunPosition={[100, 20, 100]} />
                        <ambientLight intensity={0.3} />
                        <pointLight
                            castShadow
                            intensity={0.8}
                            position={[100, 100, 100]}
                        />
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI 1 */}
                    <Help />
                    <Leva />
                </div>

                {/* ================================================== */}
                {/* UI 2 */}
                <Menu />
                <ToggledStats />
                <ToggledEditor />
            </div>
        </>
    );
}

export default StentGame;
