import * as THREE from "three";

import { FirebaseWebRTC } from "../../../src";
import {
    firestore,
    webRtcConfiguration,
    dataChannelParams,
} from "../../../lib/FirebaseRTC";
import { Message } from "@mui/icons-material";

type Message = {
    type: string;
};
type PropertiesMessage = {
    data: {
        position: number[];
        quaternion: number[];
    };
} & Message;

class RTCPlayer extends FirebaseWebRTC {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;

    constructor() {
        super(firestore, webRtcConfiguration, dataChannelParams);

        this.position = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();
    }

    setProperties(message: string) {
        const properties = JSON.parse(message) as PropertiesMessage;
        console.log(properties);

        if (properties.type === "properties") {
            this.position.fromArray(properties.data.position);
            this.quaternion.fromArray(properties.data.quaternion);

            console.log(this.position, this.quaternion);
        }
    }

    async createRoom() {
        super.createRoom();

        this.dataChannel.addEventListener("message", (event) => {
            console.log(`Data channel message: ${event.data}`);

            this.setProperties(event.data);
        });
    }

    async joinRoomById(roomId: string) {
        super.joinRoomById(roomId);

        this.dataChannel.addEventListener("message", (event) => {
            console.log(`Data channel message: ${event.data}`);

            this.setProperties(event.data);
        });
    }
}

export { RTCPlayer };
