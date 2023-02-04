/**
 *
 */
import { ReactNode } from "react";
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
import { Children } from "react";

interface gameTemplateProps {
    childrenEnv: ReactNode;
    childrenPhysics: ReactNode;
}
export function GameTemplate({
    childrenEnv,
    childrenPhysics,
}: gameTemplateProps) {
    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    // const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
    const ToggledStats = useToggle(Stats, "stats");

    const [set] = useStore((state) => [state.set]);
    const editor = useStore((state) => state.editor);

    return (
        <>
            <div className={styles.root}>
                <Canvas shadows camera={{ fov: 45 }} id={"mainCanvas"}>
                    {childrenEnv}

                    <Physics gravity={[0, -30, 0]}>
                        <ToggledDebug />
                        {childrenPhysics}
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
                                menu: !state.editor ? !state.menu : false,
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
