import { Sky } from "@react-three/drei";

import {
    Ground,
    Player,
    ControlPanel,
    BodyMatcapSelect,
    JointMatcapSelect,
} from "../prefab";
import { YBot } from "../models";

export function BasicSceneEnv() {
    return (
        <>
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.3} />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />

            <ControlPanel position={[0, 2, -5]} />
            <BodyMatcapSelect position={[-5, 1, -5]} scale={0.5} />
            <JointMatcapSelect position={[-10, 1, -5]} scale={0.5} />
        </>
    );
}

export function BasicScenePhysics() {
    return (
        <>
            <Ground />
            <Player>
                <YBot />
            </Player>
        </>
    );
}
