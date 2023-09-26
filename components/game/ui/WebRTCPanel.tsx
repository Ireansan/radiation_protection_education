"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
/**
 * @link https://webrtc.org/getting-started/firebase-rtc-codelab?hl=ja
 * @link https://github.com/webrtc/FirebaseRTC/tree/solution
 * @link https://codesandbox.io/embed/nextjs-webrtc-3kfph?file=/documentation.md&codemirror=1
 */

import { Button, TextField, IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { CustomButton, CustomTextField, RTCPlayer } from "../utils";
import { useStore } from "../../store";
import styles from "../../../styles/css/game.module.css";

/**
 * WebRTCPanel
 * main
 */
export function WebRTCPanel({ ...props }): JSX.Element {
    const localVideoRef = React.useRef<HTMLVideoElement>(null!);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null!);

    const currentRoomRef = useRef<string>("");
    const currentStateRef = useRef<string>("");

    const [disabledCameraBtn, setDisabledCameraBtn] = useState<boolean>(false);
    const [disabledCreateBtn, setDisabledCreateBtn] = useState<boolean>(true);
    const [disabledJoinBtn, setDisabledJoinBtn] = useState<boolean>(true);
    const [disabledHangupBtn, setDisabledHangupBtn] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement>(null!);

    const [set, playerProperties, onlinePlayers] = useStore((state) => [
        state.set,
        state.playerProperties,
        state.onlinePlayers,
    ]);

    useEffect(() => {
        // https://stackoverflow.com/questions/68838976/why-do-i-get-referenceerror-rtcpeerconnection-is-not-defined-in-next-js
        set((state) => ({
            onlinePlayers: {
                ...state.onlinePlayers,
                player1: new RTCPlayer(),
            },
        }));
    }, []);

    function sendData() {
        if (onlinePlayers.player1?.dataChannel.readyState === "open") {
            let data = {
                type: "properties",
                data: {
                    position: playerProperties.position.toArray(),
                    quaternion: playerProperties.quaternion.toArray(),
                },
            };

            onlinePlayers.player1?.dataChannel.send(JSON.stringify(data));
        }
    }

    return (
        <>
            <div className={`${styles.stack}`}>
                {/* --------------- Open Media --------------- */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledCameraBtn}
                        onClick={(event) => {
                            onlinePlayers.player1?.openUserMedia();

                            setDisabledCameraBtn(true);
                            setDisabledCreateBtn(false);
                            setDisabledJoinBtn(false);
                            setDisabledHangupBtn(false);
                        }}
                    >
                        Open camera & microphone
                    </CustomButton>
                </div>
                {/* --------------- Create Room --------------- */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledCreateBtn}
                        onClick={(event) => {
                            onlinePlayers.player1?.createRoom();

                            console.log(
                                "Create Room - roomId",
                                onlinePlayers.player1?.roomId
                            );
                            currentRoomRef.current = onlinePlayers.player1
                                ?.roomId
                                ? onlinePlayers.player1?.roomId
                                : "";
                            currentStateRef.current = "caller";
                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);

                            setInterval(() => {
                                sendData();
                            }, 1000);
                        }}
                    >
                        Create room
                    </CustomButton>
                </div>
                {/* --------------- Join Room --------------- */}
                <div style={{ textAlign: "center" }}>
                    <CustomTextField
                        disabled={disabledJoinBtn}
                        label="Input room ID"
                        inputRef={inputRef}
                        InputProps={{
                            style: {
                                color: "#A0A0A0",
                            },
                        }}
                        onChange={(event) => {}}
                    />
                    <CustomButton
                        variant="contained"
                        disabled={disabledJoinBtn}
                        onClick={async (event) => {
                            currentRoomRef.current = inputRef.current.value;
                            currentStateRef.current = "callee";
                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);

                            await onlinePlayers.player1?.joinRoomById(
                                inputRef.current.value
                            );

                            setInterval(() => {
                                sendData();
                            }, 1000);
                        }}
                    >
                        Join room
                    </CustomButton>
                </div>
                {/* --------------- Hungup --------------- */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledHangupBtn}
                        onClick={(event) => {
                            onlinePlayers.player1?.hangUp();

                            setDisabledCameraBtn(false);
                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);
                            setDisabledHangupBtn(true);
                        }}
                    >
                        Hangup
                    </CustomButton>
                </div>
                {/* --------------- Current State --------------- */}
                {currentRoomRef.current !== "" ? (
                    <>
                        <p>Current room is</p>
                        <p>
                            {currentRoomRef.current}
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={async () => {
                                    await global.navigator.clipboard.writeText(
                                        currentRoomRef.current
                                    );
                                }}
                            >
                                <ContentCopy fontSize="small" />
                            </IconButton>
                        </p>
                        <p> - You are the {currentStateRef.current}!</p>
                    </>
                ) : null}
            </div>
        </>
    );
}
