import React, { useState, FormEvent, ChangeEvent, useRef } from "react";
/**
 * @link https://webrtc.org/getting-started/firebase-rtc-codelab?hl=ja
 * @link https://github.com/webrtc/FirebaseRTC/tree/solution
 * @link https://codesandbox.io/embed/nextjs-webrtc-3kfph?file=/documentation.md&codemirror=1
 */
import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    getDoc,
    getDocs,
    updateDoc,
    setDoc,
    onSnapshot,
} from "firebase/firestore"; // runs firebase side effects

import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import { firestore } from "../utils";

import styles from "../../../styles/css/game_template.module.css";

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

export function WebRTCPanel({ ...props }): JSX.Element {
    // Init
    const peerConnectionRef = React.useRef<RTCPeerConnection>(null!);
    const dataChannelRef = React.useRef<RTCDataChannel>(null!);
    const localStreamRef = React.useRef<MediaStream>(null!);
    const remoteStreamRef = React.useRef<MediaStream>(null!);
    const roomIdRef = React.useRef<string>(null!);

    //
    const [currentRoom, setCurrentRoom] = useState<string>("");
    const [isInRoom, setIsInRoom] = useState<boolean>(false);

    const [disabledCameraBtn, setDisabledCameraBtn] = useState<boolean>(false);
    const [disabledCreateBtn, setDisabledCreateBtn] = useState<boolean>(true);
    const [disabledJoinBtn, setDisabledJoinBtn] = useState<boolean>(true);
    const [disabledHangupBtn, setDisabledHangupBtn] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement>(null!);

    /*
    //initialize firebase apps if there are no initialized apps
    const firebaseApp = !getApps().length
        ? initializeApp(firebaseConfig)
        : getApp();

    //since we will be interracting with firestore, we
    //grab a refference to the firestore database object and export it from this file
    const db = getFirestore(firebaseApp);
    */
    const db = firestore;

    /**
     *
     */
    function registerPeerConnectionListeners() {
        peerConnectionRef.current.addEventListener(
            "icegatheringstatechange",
            () => {
                console.log(
                    `ICE gathering state changed: ${peerConnectionRef.current.iceGatheringState}`
                );
            }
        );
        peerConnectionRef.current.addEventListener(
            "connectionstatechange",
            () => {
                console.log(
                    `Connection state change: ${peerConnectionRef.current.connectionState}`
                );
            }
        );
        peerConnectionRef.current.addEventListener(
            "signalingstatechange",
            () => {
                console.log(
                    `Signaling state change: ${peerConnectionRef.current.signalingState}`
                );
            }
        );
        peerConnectionRef.current.addEventListener(
            "iceconnectionstatechange ",
            () => {
                console.log(
                    `ICE connection state change: ${peerConnectionRef.current.iceConnectionState}`
                );
            }
        );
    }

    function registerDataChannelListeners() {
        dataChannelRef.current.addEventListener("error", (error) => {
            console.log(`Data Channel Error: ${error}`);
        });
        dataChannelRef.current.addEventListener("message", (event) => {
            console.log(`Data channel message: ${event.data}`);
        });
        dataChannelRef.current.addEventListener("open", () => {
            console.log("Data channel is open");
        });
        dataChannelRef.current.addEventListener("close", () => {
            console.log("Data channel is close");
        });
    }

    /**
     *
     */
    async function createRoom() {
        const roomRef = await doc(collection(db, "rooms"));

        // Peer Connection
        console.log(
            "Create PeerConnection with configuration: ",
            configuration
        );
        peerConnectionRef.current = new RTCPeerConnection(configuration);
        registerPeerConnectionListeners();

        // Data Channel
        dataChannelRef.current = peerConnectionRef.current.createDataChannel(
            "sendDataChannel",
            dataChannelParams
        );
        console.log("Created send data channel: ", dataChannelRef.current);
        registerDataChannelListeners();

        localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        // Collecting ICE candidates
        const callerCandidatesCollection = collection(
            roomRef,
            "callerCandidates"
        );

        peerConnectionRef.current.addEventListener("icecandidate", (event) => {
            if (!event.candidate) {
                console.log("Got final candidate!");
                return;
            }
            console.log("Got candidate: ", event.candidate);
            addDoc(callerCandidatesCollection, event.candidate.toJSON());
        });

        // Creating a room below
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log("Created offer:", offer);

        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await setDoc(roomRef, roomWithOffer);
        roomIdRef.current = roomRef.id;
        console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
        /*
        // FIXME:
        document.querySelector(
            "#currentRoom"
        ).innerText = `Current room is ${roomRef.id} - You are the caller!`;
        */

        peerConnectionRef.current.addEventListener("track", (event) => {
            console.log("Got remote track:", event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
                console.log("Add a track to the remoteStream:", track);
                remoteStreamRef.current.addTrack(track);
            });
        });

        // Listening for remote session description
        onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (
                !peerConnectionRef.current.currentRemoteDescription &&
                data &&
                data.answer
            ) {
                console.log("Got remote description: ", data.answer);
                const rtcSessionDescription = new RTCSessionDescription(
                    data.answer
                );
                await peerConnectionRef.current.setRemoteDescription(
                    rtcSessionDescription
                );
            }
        });

        // Listen for remote ICE candidates
        onSnapshot(collection(roomRef, "calleeCandidates"), (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "added") {
                    let data = change.doc.data();
                    console.log(
                        `Got new remote ICE candidate: ${JSON.stringify(data)}`
                    );
                    await peerConnectionRef.current.addIceCandidate(
                        new RTCIceCandidate(data)
                    );
                }
            });
        });
    }

    /**
     *
     */
    async function joinRoomById(roomId: string) {
        console.log(`roomid: ${roomId}`);
        const roomRef = doc(collection(db, "rooms"), `${roomId}`);
        const roomSnapshot = await getDoc(roomRef);
        console.log("Got room:", roomSnapshot.exists());

        if (roomSnapshot.exists()) {
            console.log(
                "Create PeerConnection with configuration: ",
                configuration
            );
            // FIXME:
            /*
            setPeerConnection(new RTCPeerConnection(configuration));
            registerPeerConnectionListeners();
            */
            localStreamRef.current.getTracks().forEach((track) => {
                peerConnectionRef.current.addTrack(
                    track,
                    localStreamRef.current
                );
            });

            // Collecting ICE candidates
            const calleeCandidatesCollection = collection(
                roomRef,
                "calleeCandidates"
            );
            peerConnectionRef.current.addEventListener(
                "icecandidate",
                (event) => {
                    if (!event.candidate) {
                        console.log("Got final candidate!");
                        return;
                    }
                    console.log("Got candidate: ", event.candidate);
                    addDoc(
                        calleeCandidatesCollection,
                        event.candidate.toJSON()
                    );
                }
            );
            peerConnectionRef.current.addEventListener("track", (event) => {
                console.log("Got remote track:", event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                    console.log("Add a track to the remoteStream:", track);
                    remoteStreamRef.current.addTrack(track);
                });
            });

            // Creating SDP answer
            const offer = roomSnapshot.data().offer;
            console.log("Got offer:", offer);
            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(offer)
            );
            const answer = await peerConnectionRef.current.createAnswer();
            console.log("Created answer:", answer);
            await peerConnectionRef.current.setLocalDescription(answer);

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                },
            };
            await updateDoc(roomRef, roomWithAnswer);

            // Listening for remote ICE candidates
            onSnapshot(collection(roomRef, "callerCandidates"), (snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        console.log(
                            `Got new remote ICE candidate: ${JSON.stringify(
                                data
                            )}`
                        );
                        await peerConnectionRef.current.addIceCandidate(
                            new RTCIceCandidate(data)
                        );
                    }
                });
            });
        }
    }

    /** */
    async function openUserMedia() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localStreamRef.current = stream;
        remoteStreamRef.current = new MediaStream();

        // FIXME:
        /*
        console.log("Stream:", document.querySelector("#localVideo").srcObject);
        */
    }

    /** */
    async function hangUp() {
        const tracks = localStreamRef.current.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        if (remoteStreamRef.current) {
            remoteStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Delete room on hangup
        if (roomIdRef.current) {
            const roomRef = doc(collection(db, "rooms"), roomIdRef.current);
            const calleeCandidates = await getDocs(
                collection(roomRef, "calleeCandidates")
            );
            calleeCandidates.forEach(async (candidate) => {
                await deleteDoc(candidate.ref);
            });
            const callerCandidates = await getDocs(
                collection(roomRef, "callerCandidates")
            );
            callerCandidates.forEach(async (candidate) => {
                await deleteDoc(candidate.ref);
            });
            await deleteDoc(roomRef);
        }

        // document.location.reload();
    }

    return (
        <>
            <div className={`${styles.stack}`}>
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledCameraBtn}
                        onClick={(event) => {
                            openUserMedia();

                            setDisabledCameraBtn(true);
                            setDisabledCreateBtn(false);
                            setDisabledJoinBtn(false);
                            setDisabledHangupBtn(false);
                        }}
                    >
                        Open camera & microphone
                    </CustomButton>
                </div>
                {/* Create Room */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledCreateBtn}
                        onClick={(event) => {
                            createRoom();

                            setCurrentRoom(
                                `Current room is ${roomIdRef.current} - You are the caller!`
                            );

                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);
                        }}
                    >
                        Create room
                    </CustomButton>
                </div>
                {/* Join Room */}
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
                            setCurrentRoom(
                                `Current room is ${inputRef.current.value} - You are the callee!`
                            );

                            await joinRoomById(inputRef.current.value);

                            setIsInRoom(true);

                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);
                        }}
                    >
                        Join room
                    </CustomButton>
                </div>
                {/* Hungup */}
                <div style={{ textAlign: "center" }}>
                    <CustomButton
                        variant="contained"
                        disabled={disabledHangupBtn}
                        onClick={(event) => {
                            hangUp();

                            setCurrentRoom("");

                            setDisabledCameraBtn(false);
                            setDisabledCreateBtn(true);
                            setDisabledJoinBtn(true);
                            setDisabledHangupBtn(true);
                        }}
                    >
                        Hangup
                    </CustomButton>
                </div>
                <p>{currentRoom}</p>
            </div>
        </>
    );
}
