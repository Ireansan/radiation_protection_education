import React, { useRef, useEffect, useCallback, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

/**
 * @link https://github.com/macinjoke/react-webrtc-sample
 */

interface CandidateMessage {
    type: "candidate";
    label: number | null;
    id: string | null;
    candidate: string;
}

type Message =
    | "got user media"
    | "bye"
    | CandidateMessage
    | RTCSessionDescriptionInit;

export function WebRTCSystem({ ...props }) {
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [isInitiator, setIsInitiator] = useState<boolean>(false);
    const [isChannelReady, setIsChannelReady] = useState<boolean>(false);

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream>(null!);
    const remoteStreamRef = useRef<MediaStream>(null!);
    const peerConnectionRef = useRef<RTCPeerConnection>(null);
    const socketRef = useRef<Socket>(io());
    const messageEventTargetRef = useRef<EventTarget>(new EventTarget());

    //
    const sendMessage = useCallback((message: Message) => {
        console.log("Client sending message: ", message);
        socketRef.current.emit("message", message);
    }, []);

    const setLocalAndSendMessage = useCallback(
        (sessionDescription: RTCSessionDescriptionInit) => {
            if (!peerConnectionRef.current) {
                return;
            }
            peerConnectionRef.current.setLocalDescription(sessionDescription);
            console.log(
                "setLocalAndSendMessage sending message",
                sessionDescription
            );
            sendMessage(sessionDescription);
        },
        [sendMessage]
    );

    const handleIceCandidate = useCallback(
        (event: RTCPeerConnectionIceEvent) => {
            console.log("ICECandidate event: ", event);
            if (event.candidate) {
                sendMessage({
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                });
            } else {
                console.log("End of candidates.");
            }
        },
        [sendMessage]
    );

    const onTrack = (event: RTCTrackEvent) => {
        // handleRemoteStreamAdded
        console.log("onTrack");
        if (!remoteVideoRef.current) {
            return;
        }
        if (event.streams && event.streams[0]) {
            return;
        }
        remoteStreamRef.current = new MediaStream();
        remoteStreamRef.current.addTrack(event.track);
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
    };

    const createPeerConnection = useCallback(() => {
        try {
            if (!peerConnectionRef.current) {
                return;
            }
            peerConnectionRef.current.addEventListener(
                "icecandidate",
                handleIceCandidate
            );
            peerConnectionRef.current.addEventListener("track", onTrack);
            peerConnectionRef.current.addTrack(
                localStreamRef.current.getVideoTracks()[0]
            );
            setIsStarted(true);
            console.log("Created RTCPeerConnnection");
        } catch (error: any) {
            console.log(
                "Failed to create PeerConnection, exception: " + error.message
            );
            alert("Cannot create RTCPeerConnection object.");
            return;
        }
    }, [handleIceCandidate]);

    const maybeStart = useCallback(async () => {
        console.log(">>>>>>> maybeStart() ", isStarted, isChannelReady);
        if (!isStarted && isChannelReady) {
            console.log(">>>>>> creating peer connection");
            createPeerConnection();
            setIsStarted(true);
            console.log("isInitiator", isInitiator);
            if (isInitiator) {
                if (!peerConnectionRef.current) {
                    return;
                }
                // Obsolete: doCall();
                console.log("Sending offer to peer");
                const description =
                    await peerConnectionRef.current.createOffer();
                setLocalAndSendMessage(description);
            }
        }
    }, [
        isChannelReady,
        isStarted,
        isInitiator,
        createPeerConnection,
        setLocalAndSendMessage,
    ]);

    //
    useEffect(() => {
        console.log(`hostname: ${location.hostname}`);
        const room = "foo" as string;

        if (room !== "") {
            socketRef.current.emit("create or join", room);
            console.log("Attempted to create or  join room", room);
        }
        socketRef.current.removeAllListeners();

        socketRef.current.on("created", function (room) {
            console.log("Created room " + room);
            setIsInitiator(true);
        });

        socketRef.current.on("full", function (room) {
            console.log("Room " + room + " is full");
        });

        socketRef.current.on("join", function (room) {
            console.log("Another peer made a request to join room " + room);
            console.log("This peer is the initiator of room " + room + "!");
            setIsChannelReady(true);
        });

        socketRef.current.on("joined", function (room) {
            console.log("joined: " + room);
            setIsChannelReady(true);
        });

        socketRef.current.on("log", function (array) {
            console.log.apply(console, array);
        });

        // Obsolete: handleRemoteHangup
        function byeCallback() {
            console.log("Session terminated.");
            // Obsolete: stop();
            setIsStarted(false);
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }

            setIsInitiator(false);
        }
        messageEventTargetRef.current.addEventListener("bye", byeCallback);

        const answerCallback = async (e: any) => {
            const message = e.detail;
            if (!peerConnectionRef.current) return;
            peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(message)
            );
        };
        messageEventTargetRef.current.addEventListener(
            "answer",
            answerCallback
        );

        socketRef.current.on("message", async (message: Message) => {
            if (typeof message === "string") {
                messageEventTargetRef.current.dispatchEvent(new Event(message));
            } else {
                messageEventTargetRef.current.dispatchEvent(
                    new CustomEvent(message.type, { detail: message })
                );
            }
        });
        (async () => {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
                sendMessage("got user media");
            }
        })();

        window.addEventListener("beforeunload", () => {
            sendMessage("bye");
        });

        return () => {
            messageEventTargetRef.current.removeEventListener(
                "bye",
                byeCallback
            );
            messageEventTargetRef.current.removeEventListener(
                "answer",
                answerCallback
            );

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }

            if (localStreamRef.current) {
                localStreamRef.current.getTracks()[0].stop();
            }
            sendMessage("bye");

            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [sendMessage]);

    //
    useEffect(() => {
        const callback = () => {
            console.log("got user media");
            if (isInitiator) {
                maybeStart();
            }
        };
        messageEventTargetRef.current.addEventListener(
            "got user media",
            callback
        );

        return () => {
            messageEventTargetRef.current.removeEventListener(
                "got user media",
                callback
            );
        };
    }, [isInitiator, isChannelReady, maybeStart]);

    //
    useEffect(() => {
        const callback = async (e: any) => {
            const message = e.detail;
            if (!peerConnectionRef.current || !isStarted) return;
            const candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate,
            });
            peerConnectionRef.current.addIceCandidate(candidate);
        };
        messageEventTargetRef.current.addEventListener("candidate", callback);

        return () => {
            if (messageEventTargetRef.current) {
                messageEventTargetRef.current.removeEventListener(
                    "candidate",
                    callback
                );
            }
        };
    }, [isStarted]);

    useEffect(() => {
        const callback = async (e: any) => {
            const message = e.detail;
            if (!isInitiator && !isStarted) {
                await maybeStart();
            }
            if (!peerConnectionRef.current) {
                return;
            }
            peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(message)
            );
            // Obsolete: doAnswer();
            console.log("Sending answer to peer.");
            const description = await peerConnectionRef.current.createAnswer();
            setLocalAndSendMessage(description);
        };
        messageEventTargetRef.current.addEventListener("offer", callback);

        return () => {
            if (messageEventTargetRef.current) {
                messageEventTargetRef.current.removeEventListener(
                    "offer",
                    callback
                );
            }
        };
    }, [
        isInitiator,
        isStarted,
        isChannelReady,
        maybeStart,
        setLocalAndSendMessage,
    ]);

    return (
        <>
            <div>
                <h2>Sample 5</h2>
                <p>Signaling and video Peer Connection</p>
                <p>isStarted: {String(isStarted)},</p>
                <p>isChannelReady: {String(isChannelReady)}</p>
                <p>isInitiator: {String(isInitiator)}</p>
                <video
                    ref={localVideoRef}
                    style={{ width: "320px", maxWidth: "100%" }}
                    autoPlay
                    playsInline
                />
                <video
                    ref={remoteVideoRef}
                    style={{ width: "320px", maxWidth: "100%" }}
                    autoPlay
                    playsInline
                />
            </div>
        </>
    );
}
