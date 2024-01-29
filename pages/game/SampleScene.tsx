import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Leva } from "leva";

// ==========
// Game
import {
    // ----------
    // controls
    Keyboard,
    // ----------
    // models
    YBot,
    // ----------
    // prefab
    ControlPanel,
    Ground,
    BodyMatcapSelect,
    JointMatcapSelect,
    OnlinePlayer,
    Player,
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
// Store
import { useStore } from "../../components/store";

// ==========
// Styles
import styles from "../../styles/css/game.module.css";

function SampleScene() {
    const [menu, set] = useStore((state) => [state.menu, state.set]);
    const editor = useStore((state) => state.editor);

    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    // const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
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
                        {/* Three.js Object */}
                        <ControlPanel position={[0, 2, -5]} />
                        <BodyMatcapSelect
                            position={[-5, 1, -5]}
                            scale={0.5}
                        />
                        <JointMatcapSelect
                            position={[-10, 1, -5]}
                            scale={0.5}
                        />
                        <ControlPanel position={[0, 2, -5]} />

                        <OnlinePlayer />

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

export default SampleScene;
