/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/5debaf2c0c8309b72f3504a4c20d22ec9fb88082/packages/fiber/src/three-types.ts
 */

import * as THREE from "three";
import { Object3DNode } from "@react-three/fiber";

import { volumeObject } from "./volumeObject";

export type VolumeObjectProps = Object3DNode<volumeObject, typeof volumeObject>

export interface ThreeElements {
    volumeObject: VolumeObjectProps
}
