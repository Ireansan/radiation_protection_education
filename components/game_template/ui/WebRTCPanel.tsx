import React, { useState, useRef, useEffect, useMemo } from "react";
/**
 * @link https://webrtc.org/getting-started/firebase-rtc-codelab?hl=ja
 * @link https://github.com/webrtc/FirebaseRTC/tree/solution
 * @link https://codesandbox.io/embed/nextjs-webrtc-3kfph?file=/documentation.md&codemirror=1
 */

import { Button, TextField, IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// import { useWebRTC } from "./useWebRTC";
import { FirebaseWebRTC } from "../../../src";
import { firestore } from "../utils";
import styles from "../../../styles/css/game_template.module.css";

/**
 * WebRTC configs
 */
const configuration = {
    iceServers: [
        {
            // STUN
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
            // TURN
        },
    ],
    iceCandidatePoolSize: 10,
};
const dataChannelParams = { ordered: false };

/**
 * Custom MUI Button and Field
 */
const CustomButton = styled(Button)({
    "&:disabled": {
        backgroundColor: "#202020",
        color: "#404040",
    },
});
const CustomTextField = styled(TextField)({
    "& label": {
        color: "#606060",
        "&.Mui-focused": {
            color: "#606060",
        },
        "&.Mui-disabled": {
            color: "#202020",
        },
    },
    "& .MuiInput-underline:after": {
        borderColor: "#606060",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#808080",
        },
        "&:hover fieldset": {
            borderColor: "#606060",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#606060",
        },
        "&.Mui-disabled fieldset": {
            borderColor: "#202020",
        },
    },
});

/**
 * WebRTCPanel
 * main
 */
export function WebRTCPanel({ ...props }): JSX.Element {
    const localVideoRef = React.useRef<HTMLVideoElement>(null!);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null!);
    const [firebaseWebRTC, setFirebaseWebRTC] = useState<FirebaseWebRTC>(null!);

    const currentRoomRef = useRef<string>("");
    const currentStateRef = useRef<string>("");

    const [disabledCameraBtn, setDisabledCameraBtn] = useState<boolean>(false);
    const [disabledCreateBtn, setDisabledCreateBtn] = useState<boolean>(true);
    const [disabledJoinBtn, setDisabledJoinBtn] = useState<boolean>(true);
    const [disabledHangupBtn, setDisabledHangupBtn] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        // https://stackoverflow.com/questions/68838976/why-do-i-get-referenceerror-rtcpeerconnection-is-not-defined-in-next-js
        setFirebaseWebRTC(
            new FirebaseWebRTC(firestore, configuration, dataChannelParams)
        );
    }, []);

    useEffect(() => {
        if (firebaseWebRTC) {
            localVideoRef.current.srcObject = firebaseWebRTC.localStream;
            remoteVideoRef.current.srcObject = firebaseWebRTC.remoteStream;
        }
    }, [firebaseWebRTC]);

    return (
        <>
            <div className={`${styles.stack}`}>
                {/* --------------- Open Media --------------- */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledCameraBtn}
                        onClick={(event) => {
                            firebaseWebRTC.openUserMedia();

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
                            firebaseWebRTC.createRoom();

                            console.log(
                                "Create Room - roomId",
                                firebaseWebRTC.roomId
                            );
                            currentRoomRef.current = firebaseWebRTC.roomId
                                ? firebaseWebRTC.roomId
                                : "";
                            currentStateRef.current = "caller";
                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);

                            setInterval(function () {
                                // FIXME: Test
                                if (
                                    firebaseWebRTC.dataChannel.readyState ===
                                    "open"
                                ) {
                                    console.log(
                                        "Caller Send",
                                        firebaseWebRTC.dataChannel
                                    );
                                    firebaseWebRTC.dataChannel.send("Caller");
                                }
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

                            await firebaseWebRTC.joinRoomById(
                                inputRef.current.value
                            );

                            setInterval(function () {
                                // FIXME: Test
                                if (
                                    firebaseWebRTC.dataChannel.readyState ===
                                    "open"
                                ) {
                                    console.log(
                                        "Callee Send",
                                        firebaseWebRTC.dataChannel
                                    );
                                    firebaseWebRTC.dataChannel.send("Callee");
                                }
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
                            firebaseWebRTC.hangUp();

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
                {/* --------------- Local Video --------------- */}
                <video
                    id="localVideo"
                    ref={localVideoRef}
                    muted
                    autoPlay
                    playsInline
                    style={{ width: "100%" }}
                ></video>
                {/* --------------- Remote Video --------------- */}
                <video
                    id="remoteVideo"
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: "100%" }}
                ></video>
            </div>
        </>
    );
}
