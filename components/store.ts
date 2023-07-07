/**
 * @link https://codesandbox.io/s/racing-game-lo6kp?file=/src/store.ts
 */

import { createRef } from "react";
import create, { StoreApi } from "zustand";
import shallow from "zustand/shallow";
import * as THREE from "three";
import type { Object3D } from "three";

import { RTCPlayer } from "./game/utils";

export const angularVelocity = [0, 0.5, 0] as const;
export const cameras = ["FIRST_PERSON", "THIRD_PERSON"] as const;

const controls = {
    backward: false,
    boost: false,
    forward: false,
    left: false,
    right: false,
    jump: false,
    grounded: false,
    operation: false,
};

const states = {
    animation: "idle",
};

export const debug = false as const;
export const dpr = 1.5 as const;
export const position = [-110, 0.75, 220] as const;
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const;
export const shadows = true as const;
export const stats = false as const;

/**
 * matcapList
 * @link https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
 *
 * color palette
 * @link https://qiita.com/nemutas/items/6202b3f8458376ab79b6#paramsts
 */
export const matcapList = [
    92, 45, 20, 21, 25, 28, 26, 39, 58, 540, 544, 546, 550, 580, 586, 613, 635,
    639,
] as const;
export type MatcapList = (typeof matcapList)[number];

export const playerConfig = {
    radius: 0.5,
    halfHeight: 0.6,
    moveSpeed: 5,
    boost: 2,
    cameraDistance: 5.0,
    cameraRotateSpeed: 1.0,
    followCameraDirection: 0,
    bodyMatcap: matcapList[1],
    jointMatcap: matcapList[0],
};

const playerProperties = {
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
};

const onlinePlayers = {
    player1: undefined,
};

const actionNames = ["reset"] as const;
export type ActionNames = (typeof actionNames)[number];

type Camera = (typeof cameras)[number];
export type Controls = typeof controls;
export type States = typeof states;

/**
 * @link https://github.com/pmndrs/zustand/blob/ca059788d3f015b1582dc4d82b2bd4dbb6d93de4/src/vanilla.ts#L141
 * @link https://github.com/pmndrs/zustand/blob/ca059788d3f015b1582dc4d82b2bd4dbb6d93de4/src/vanilla.ts#L152
 */
type Getter = StoreApi<IState>["getState"];
export type Setter = StoreApi<IState>["setState"];

export type PlayerConfig = typeof playerConfig;
export type PlayerProperties = typeof playerProperties;
export type OnlinePlayers = {
    player1: RTCPlayer | undefined;
};

const booleans = [
    "debug",
    "editor",
    "help",
    "leaderboard",
    "map",
    "menu",
    "play",
    "ready",
    "shadows",
    "sound",
    "stats",
] as const;
type Booleans = (typeof booleans)[number];

type BaseState = {
    [K in Booleans]: boolean;
};

export interface IState extends BaseState {
    actions: Record<ActionNames, () => void>;
    camera: Camera;
    controls: Controls;
    states: States;
    get: Getter;
    set: Setter;
    playerConfig: PlayerConfig;
    playerProperties: PlayerProperties;
    onlinePlayers: OnlinePlayers;
}

const useStoreImpl = create<IState>(
    (set: StoreApi<IState>["setState"], get: StoreApi<IState>["getState"]) => {
        const actions = {
            reset: () => {
                set((state) => {
                    console.log("reset");
                    return { ...state };
                });
            },
        };

        return {
            actions,
            bestCheckpoint: 0,
            camera: cameras[0],
            chassisBody: createRef<Object3D>(),
            controls,
            debug,
            editor: false,
            get,
            help: false,
            leaderboard: false,
            play: true,
            map: true,
            menu: true,
            ready: false,
            session: null,
            set,
            shadows,
            sound: true,
            states,
            stats,
            playerConfig,
            playerProperties,
            onlinePlayers,
        };
    }
);

interface Mutation {
    speed: number;
    sliding: boolean;
    velocity: [number, number, number];
    rotation: THREE.Vector3;
}

export const mutation: Mutation = {
    speed: 0,
    sliding: false,
    velocity: [0, 0, 0],
    rotation: new THREE.Vector3(),
};

// Make the store shallow compare by default
/**
 *
 * @link https://github.com/pmndrs/zustand/blob/ca059788d3f015b1582dc4d82b2bd4dbb6d93de4/src/vanilla.ts#L114
 */
const useStore = <T>(sel: (s: IState) => T) => useStoreImpl(sel, shallow);
Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };
