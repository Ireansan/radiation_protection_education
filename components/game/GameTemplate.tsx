/**
 *
 */
import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Leva } from "leva";

import { Keyboard } from "./controls";
import { Ground, Player, ControlPanel } from "./prefab";
import { Editor, Help, Menu } from "./ui";
import { useToggle } from "./useToggle";

import { useStore } from "../store";

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

    const [menu, set] = useStore((state) => [state.menu, state.set]);
    const editor = useStore((state) => state.editor);

    return (
        <>
            <div className={styles.root}>
                <div
                    className={`${styles.fullscreen}
                    ${menu && `${styles.clicked}`}`}
                >
                    <Canvas shadows camera={{ fov: 45 }} id={"mainCanvas"}>
                        {childrenEnv}

                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            {childrenPhysics}
                        </Physics>
                        <ControlPanel position={[0, 2, -5]} />

                        <Keyboard />
                    </Canvas>
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
