/**
 * @de
 */

import { Canvas } from "@react-three/fiber";
import {
    Sky,
    OrbitControls,
    PointerLockControls,
    Stats,
} from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

import { Keyboard } from "./controls";
import { Ground, Player, ControlPanel } from "./prefab";
import { Editor } from "./ui";
import { useToggle } from "./useToggle";

export default function App() {
    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
    const ToggledStats = useToggle(Stats, "stats");

    return (
        <>
            <Canvas shadows camera={{ fov: 45 }}>
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
            </Canvas>

            <Keyboard />
            <ToggledEditor />
            <ToggledStats />
        </>
    );
}
