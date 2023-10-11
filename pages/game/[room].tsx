import {
    NextPage,
    GetStaticPaths,
    GetStaticProps,
    InferGetStaticPropsType,
} from "next";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Leva } from "leva";

// ==========
// Game
import {
    // ----------
    // controls
    Keyboard,
    // ----------
    // models
    YBot,
    // ----------
    // prefab
    ControlPanel,
    Ground,
    BodyMatcapSelect,
    JointMatcapSelect,
    OnlinePlayer,
    Player,
    // ----------
    // ui
    Editor,
    Help,
    Menu,
    // ----------
    // hook
    useToggle,
} from "../../components/game";

// ==========
// Store
import { useStore } from "../../components/store";

import * as FUNCTIONS from "firebase/functions";
import {
    firestore,
    webRtcConfiguration,
    dataChannelParams,
} from "../../lib/FirebaseRTC";
import { RTCPlayer } from "../../components/game/utils";

import styles from "../../styles/css/game.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { room: "room1" },
            },
            {
                params: { room: "room2" },
            },
            {
                params: { room: "room3" },
            },
            {
                params: { room: "room4" },
            },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const roomId = params?.room;

    // firestore;

    const staticProps = {
        roomId: roomId,
        // test: new RTCPlayer(firestore, webRtcConfiguration, dataChannelParams),
        // FIXME: 前に調べた際にも出てきたが，RTCPeerConnectionはuseEffect内で宣言する必要がある
        // https://stackoverflow.com/questions/68838976/why-do-i-get-referenceerror-rtcpeerconnection-is-not-defined-in-next-js
    };

    return {
        props: { staticProps },
    };
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

function Room({ staticProps }: PageProps) {
    const ToggledDebug = useToggle(Debug, "debug");
    const ToggledEditor = useToggle(Editor, "editor");
    // const ToggledMap = useToggle(Minimap, "map");
    const ToggledOrbitControls = useToggle(OrbitControls, "editor");
    // const ToggledPointerLockControls = useToggle(PointerLockControls, "play");
    const ToggledStats = useToggle(Stats, "stats");

    const [menu, set] = useStore((state) => [state.menu, state.set]);
    const editor = useStore((state) => state.editor);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users/")
            .then((response) => response.json())
            .then((users) => {
                console.log("TEST: jsonplaceholder, user ");
                for (var user of users) {
                    console.log(user.name);
                }
            });
    }, []);

    return (
        <>
            {console.log("test", staticProps)}
            <div className={styles.root}>
                <div
                    className={`${styles.fullscreen}
                    ${menu && `${styles.clicked}`}`}
                >
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas shadows camera={{ fov: 45 }} id={"mainCanvas"}>
                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <ControlPanel position={[0, 2, -5]} />
                        <BodyMatcapSelect position={[-5, 1, -5]} scale={0.5} />
                        <JointMatcapSelect
                            position={[-10, 1, -5]}
                            scale={0.5}
                        />
                        <ControlPanel position={[0, 2, -5]} />

                        <OnlinePlayer />

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <Sky sunPosition={[100, 20, 100]} />
                        <ambientLight intensity={0.3} />
                        <pointLight
                            castShadow
                            intensity={0.8}
                            position={[100, 100, 100]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                            <Ground />
                            <Player>
                                <YBot />
                            </Player>
                        </Physics>

                        {/* -------------------------------------------------- */}
                        {/* Player Contorls */}
                        <Keyboard />
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI */}
                    <Help />
                    <Leva />
                </div>

                <Menu />
                <ToggledStats />
                <ToggledEditor />
            </div>
        </>
    );
}

export default Room;
