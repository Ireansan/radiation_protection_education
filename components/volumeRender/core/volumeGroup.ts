import * as THREE from "three";
import { Object3DNode } from "@react-three/fiber";
import { Volume } from "three-stdlib";

import { VolumeObject } from "./volumeObject";
import volumeRenderShader from "../shaders/volumeShader";
import { cmtextures } from "../textures";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @function Group
 * @abstract Core
 * @param volume any
 * @param clim1 number, Default 0
 * @param clim2 number, Default 1
 * @param colormap string, Default viridis
 * @param renderstyle string, Default mip
 * @param isothreshold number, Default 0.1
 * @param clipping boolean, Default false
 * @param planes THREE.Plane
 */
export class VolumeGroup extends VolumeObject {
    isGroup: boolean;

    constructor() {
        super();

        this.isGroup = true;
        this.type = "Group";
    }
}

/**
 * @link https://github.com/pmndrs/react-three-fiber/blob/26cf7eed4f9bddd79305a1f61b20554b07fdff1b/docs/tutorials/typescript.mdx#extend-usage
 */

export type VolumeObjectProps = Object3DNode<VolumeObject, typeof VolumeObject>;

declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeObject: VolumeObjectProps;
    }
}
