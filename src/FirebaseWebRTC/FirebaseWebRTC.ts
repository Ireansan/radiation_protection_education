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
import type { Firestore } from "firebase-admin/firestore";

type RTCSessionDescriptionProps = {
    offer: {
        type: RTCSdpType;
        sdp: string | undefined;
    };
};

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
        const roomRef = await this.db.collection("rooms").doc();

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
        const callerCandidatesCollection =
            roomRef.collection("callerCandidates");

        this.peerConnection.addEventListener("icecandidate", (event) => {
            if (!event.candidate) {
                console.log("Got final candidate!");
                return;
            }
            console.log("Got candidate: ", event.candidate);
            callerCandidatesCollection.add(event.candidate.toJSON());
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
        await roomRef.set(roomWithOffer);
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
        roomRef.onSnapshot(async (snapshot) => {
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
        roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
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
        const roomRef = await this.db.collection("rooms").doc(`${roomId}`);
        const roomSnapshot = await roomRef.get();
        console.log("Got room:", roomSnapshot !== undefined);

        if (roomSnapshot) {
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
            const calleeCandidatesCollection =
                roomRef.collection("calleeCandidates");
            this.peerConnection.addEventListener("icecandidate", (event) => {
                if (!event.candidate) {
                    console.log("Got final candidate!");
                    return;
                }
                console.log("Got candidate: ", event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
            });
            this.peerConnection.addEventListener("track", (event) => {
                console.log("Got remote track:", event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                    console.log("Add a track to the remoteStream:", track);
                    this.remoteStream.addTrack(track);
                });
            });

            // Creating SDP answer
            if (roomSnapshot.data()) {
                const data = roomSnapshot.data() as RTCSessionDescriptionProps;
                const offer = data.offer;
                console.log("Got offer:", offer);
                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription(offer)
                );
            }
            const answer = await this.peerConnection.createAnswer();
            console.log("Created answer:", answer);
            await this.peerConnection.setLocalDescription(answer);

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                },
            };
            await roomRef.update(roomWithAnswer);

            // Listening for remote ICE candidates
            roomRef.collection("callerCandidates").onSnapshot((snapshot) => {
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
            const roomRef = this.db.collection("rooms").doc(this.roomId);
            const calleeCandidates = await roomRef
                .collection("calleeCandidates")
                .get();
            calleeCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            const callerCandidates = await roomRef
                .collection("callerCandidates")
                .get();
            callerCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            await roomRef.delete();
        }
        // document.location.reload();
    }
}
