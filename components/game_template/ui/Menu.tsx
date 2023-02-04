/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Intro.tsx
 */

import { useEffect, useState } from "react";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { Button } from "@mui/material";

import { useStore } from "../store";
import { Keys } from "./Help";
import { Setting } from "./Setting";

import styles from "../../../styles/css/game_template.module.css";

interface MenuProps {}

export function Menu({ ...props }: MenuProps): JSX.Element {
    const [menu, set] = useStore((state) => [state.menu, state.set]);

    return (
        <>
            <div
                className={`${styles.fullscreen} ${styles.bg} 
                    ${styles.ready}
                    ${!menu && `${styles.clicked}`}`}
            >
                <div className={`${styles.stack}`}>
                    <div className="intro-keys">
                        <Keys style={{ paddingBottom: 20 }} />
                        <div
                            id="instructions"
                            // className={`${styles["continue-link"]}`}
                            // href="#"
                            onClick={() => {
                                console.log("onClick");
                            }}
                        >
                            <Button variant="contained">
                                Click to continue
                            </Button>
                        </div>
                    </div>
                    <Setting />
                </div>
                <footer>
                    <a href="https://github.com/pmndrs/react-three-fiber">
                        @react-three/fiber
                    </a>
                    <a href="https://github.com/pmndrs/racing-game">
                        /racing-game
                    </a>
                    <a href="https://codesandbox.io/s/vkgi6">/minecraft</a>
                </footer>
            </div>
        </>
    );
}
