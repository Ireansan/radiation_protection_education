/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Intro.tsx
 */

import { useState, FormEvent, ChangeEvent } from "react";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TextFieldProps } from "@mui/material";

import { useStore } from "../../store";
import { Keys } from "./Help";
import { WebRTCPanel } from "./WebRTCPanel";
import { Setting } from "./Setting";

import styles from "../../../styles/css/game.module.css";

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
                <div className={`${styles.stacks}`}>
                    <div className={`${styles.stack}`}>
                        <Keys style={{ paddingBottom: 20 }} />
                        <div style={{ textAlign: "center" }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    console.log("onClick");
                                    set((state) => ({
                                        menu: false,
                                    }));
                                }}
                            >
                                Click to continue
                            </Button>
                        </div>
                    </div>
                </div>
                <footer>
                    <a href="https://github.com/pmndrs/react-three-fiber">
                        react-three/fiber
                    </a>
                    <br />
                    <a href="https://github.com/pmndrs/racing-game">
                        racing-game
                    </a>
                    <br />
                    <a href="https://codesandbox.io/s/vkgi6">minecraft</a>
                    <br />
                    <a href="https://www.mixamo.com/#/">Mixamo</a>
                </footer>
            </div>
        </>
    );
}
