/**
 *
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
import { Editor, Help, Menu } from "./ui";
import { useToggle } from "./useToggle";

import { useStore } from "./store";

import styles from "../../styles/css/game_template.module.css";

export default function App() {
    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    // const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
    const ToggledStats = useToggle(Stats, "stats");

    const [set] = useStore((state) => [state.set]);
    const editor = useStore((state) => state.editor);

    /**
     * NOTE: Enviroment
     * @link https://sketchfab.com/3d-models/star-wars-the-clone-wars-venator-prefab-8a1e1760391c4ac6a50373c2bf5efa2e
     * @link https://sketchfab.com/3d-models/the-picture-gallery-231fdb3e9e354c6faaa3c250f8c9988f
     * @link https://sketchfab.com/3d-models/the-hallwyl-museum-1st-floor-combined-f74eefe9f1cd4a2795a689451e723ee9
     * @link https://sketchfab.com/3d-models/crane-mast-3b943b2211284d0cb0bbad32399be58c
     */
    return (
        <>
            <div className={styles.root}>
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
                    {/* <ToggledPointerLockControls */}
                    <PointerLockControls
                        selector={"#instructions"}
                        // FIXME: flag bug
                        onLock={() => {
                            console.log("onLock");

                            set((state) => ({
                                menu: false,
                            }));
                        }}
                        onUnlock={() => {
                            console.log("onUnlock");

                            set((state) => ({
                                menu: true,
                            }));
                        }}
                    />
                    <Keyboard />
                </Canvas>
                <Help />
                <ToggledEditor />
                <ToggledStats />
                <Menu />
            </div>
        </>
    );
}
