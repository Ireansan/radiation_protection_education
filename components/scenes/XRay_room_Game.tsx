import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrthographicCamera,
    OrbitControls,
    Sky,
    Stats,
    PointerLockControls,
    GizmoHelper,
    GizmoViewport,
    Box,
    Sphere,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";

import { VolumeControls } from "../volumeRender";
import * as MODELS from "../models";
import * as SCENES from "./index";

import {
    Keyboard,
    Ground,
    Player,
    ControlPanel,
    Editor,
    useToggle,
} from "../game_template";

function XRayRoomGame() {
    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
    const ToggledStats = useToggle(Stats, "stats");

    return (
        <>
            <Canvas shadows>
                {/* Volume Render */}
                <VolumeControls>
                    <MODELS.Dose_all_Animation
                        position={[2.1, 2.2, 2.35]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                        scale={1 / 20}
                    />
                </VolumeControls>
                <group
                    position={[0, 2, 0]}
                    rotation={[0, 0, Math.PI]}
                    scale={(1 / 4) * (1 / 20)}
                >
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                {/* Game */}
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.3} />
                <pointLight
                    castShadow
                    intensity={0.8}
                    position={[100, 100, 100]}
                />

                <Physics gravity={[0, -30, 0]}>
                    <ToggledDebug />

                    <Ground />
                    <Player />
                </Physics>
                <ControlPanel position={[0, 2, -5]} />

                <ToggledOrbitControls />
                <ToggledPointerLockControls />

                {/* Camera and Some Helper */}
                <ambientLight intensity={0.5} />
                <OrthographicCamera />

                <GizmoHelper
                    alignment="bottom-right"
                    margin={[80, 80]}
                    renderPriority={-1}
                >
                    <GizmoViewport
                        axisColors={["hotpink", "aquamarine", "#3498DB"]}
                        labelColor="black"
                    />
                </GizmoHelper>
            </Canvas>

            <Keyboard />
            <ToggledEditor />
            <ToggledStats />
        </>
    );
}

export default XRayRoomGame;
