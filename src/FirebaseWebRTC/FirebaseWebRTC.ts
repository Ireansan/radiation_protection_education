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
import type { Firestore } from "firebase/firestore";

export class FirebaseWebRTC {
    db: Firestore;
    configuration: RTCConfiguration;
    dataChannelParams: RTCDataChannelInit;

    peerConnection: RTCPeerConnection;
    dataChannel: RTCDataChannel;
    roomId: string | undefined;
    localStream: MediaStream;
    remoteStream: MediaStream;
    // localVideo: HTMLVideoElement;
    // remoteVideo: HTMLVideoElement;

    constructor(
        db: Firestore,
        configuration: RTCConfiguration,
        dataChannelParams: RTCDataChannelInit
    ) {
        this.db = db;
        this.configuration = configuration;
        this.dataChannelParams = dataChannelParams;

        this.peerConnection = new RTCPeerConnection(configuration);
        this.dataChannel = this.peerConnection.createDataChannel(
            "sendDataChannel",
            dataChannelParams
        );

        this.localStream = new MediaStream();
        this.remoteStream = new MediaStream();

        // this.localVideo = localVideo;
        // this.remoteVideo = remoteVideo;
    }

    /*************************
     * registerPeerConnectionListeners
     *************************/
    registerPeerConnectionListeners() {
        this.peerConnection.addEventListener("icegatheringstatechange", () => {
            console.log(
                `ICE gathering state changed: ${this.peerConnection.iceGatheringState}`
            );
        });
        this.peerConnection.addEventListener("connectionstatechange", () => {
            console.log(
                `Connection state change: ${this.peerConnection.connectionState}`
            );
        });
        this.peerConnection.addEventListener("signalingstatechange", () => {
            console.log(
                `Signaling state change: ${this.peerConnection.signalingState}`
            );
        });
        this.peerConnection.addEventListener(
            "iceconnectionstatechange ",
            () => {
                console.log(
                    `ICE connection state change: ${this.peerConnection.iceConnectionState}`
                );
            }
        );
    }

    /*************************
     * registerDataChannelListeners
     *************************/
    registerDataChannelListeners() {
        this.dataChannel.addEventListener("error", (error) => {
            console.log(`Data Channel Error: ${error}`);
        });
        this.dataChannel.addEventListener("message", (event) => {
            console.log(`Data channel message: ${event.data}`);
        });
        this.dataChannel.addEventListener("open", () => {
            console.log("Data channel is open");
        });
        this.dataChannel.addEventListener("close", () => {
            console.log("Data channel is close");
        });
    }

    /*************************
     * createRoom
     *************************/
    async createRoom() {
        const roomRef = await doc(collection(this.db, "rooms"));

        // Peer Connection
        console.log(
            "Create PeerConnection with configuration: ",
            this.configuration
        );
        console.log("roomRef: ", roomRef);
        this.registerPeerConnectionListeners();

        // Data Channel
        console.log("Created send data channel: ", this.dataChannel);
        this.registerDataChannelListeners();

        // Stream Data
        this.localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, this.localStream);
        });

        // Collecting ICE candidates
        const callerCandidatesCollection = collection(
            roomRef,
            "callerCandidates"
        );

        this.peerConnection.addEventListener("icecandidate", (event) => {
            if (!event.candidate) {
                console.log("Got final candidate!");
                return;
            }
            console.log("Got candidate: ", event.candidate);
            addDoc(callerCandidatesCollection, event.candidate.toJSON());
        });

        // Creating a room
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log("Created offer:", offer);

        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await setDoc(roomRef, roomWithOffer);
        console.log("Set Document:", roomWithOffer);
        this.roomId = roomRef.id;
        console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

        this.peerConnection.addEventListener("track", (event) => {
            console.log("Got remote track:", event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
                console.log("Add a track to the remoteStream:", track);
                this.remoteStream.addTrack(track);
            });
        });

        // Listening for remote session description
        onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (
                !this.peerConnection.currentRemoteDescription &&
                data &&
                data.answer
            ) {
                console.log("Got remote description: ", data.answer);
                const rtcSessionDescription = new RTCSessionDescription(
                    data.answer
                );
                await this.peerConnection.setRemoteDescription(
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
                    await this.peerConnection.addIceCandidate(
                        new RTCIceCandidate(data)
                    );
                }
            });
        });
    }

    /*************************
     * joinRoomById
     *************************/
    async joinRoomById(roomId: string) {
        console.log(`roomid: ${roomId}`);
        const roomRef = await doc(collection(this.db, "rooms"), `${roomId}`);
        const roomSnapshot = await getDoc(roomRef);
        console.log("Got room:", roomSnapshot.exists());

        if (roomSnapshot.exists()) {
            // Peer Connection
            console.log(
                "Create PeerConnection with configuration: ",
                this.configuration
            );
            this.registerPeerConnectionListeners();

            // Data Channel
            this.peerConnection.addEventListener("datachannel", (event) => {
                console.log("Data Chaneel Event", event.channel);
                this.dataChannel = event.channel;
                console.log("Created send data channel: ", this.dataChannel);
                this.registerDataChannelListeners();
            });

            // Stream Data
            this.localStream.getTracks().forEach((track) => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Collecting ICE candidates
            const calleeCandidatesCollection = collection(
                roomRef,
                "calleeCandidates"
            );
            this.peerConnection.addEventListener("icecandidate", (event) => {
                if (!event.candidate) {
                    console.log("Got final candidate!");
                    return;
                }
                console.log("Got candidate: ", event.candidate);
                addDoc(calleeCandidatesCollection, event.candidate.toJSON());
            });
            this.peerConnection.addEventListener("track", (event) => {
                console.log("Got remote track:", event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                    console.log("Add a track to the remoteStream:", track);
                    this.remoteStream.addTrack(track);
                });
            });

            // Creating SDP answer
            const offer = roomSnapshot.data().offer;
            console.log("Got offer:", offer);
            await this.peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );
            const answer = await this.peerConnection.createAnswer();
            console.log("Created answer:", answer);
            await this.peerConnection.setLocalDescription(answer);

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
                        await this.peerConnection.addIceCandidate(
                            new RTCIceCandidate(data)
                        );
                    }
                });
            });
        }
    }

    /*************************
     * openUserMedia
     *************************/
    async openUserMedia() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        this.localStream = stream;
        this.remoteStream = new MediaStream();

        // this.localVideo.srcObject = this.localStream;
        // this.remoteVideo.srcObject = this.remoteStream;
    }

    /*************************
     * hangUp
     *************************/
    async hangUp() {
        const tracks = this.localStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach((track) => track.stop());
        }

        if (this.peerConnection) {
            this.peerConnection.close();
        }

        // Delete room on hangup
        if (this.roomId) {
            const roomRef = doc(collection(this.db, "rooms"), this.roomId);
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
}
