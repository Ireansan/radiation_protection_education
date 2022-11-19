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
    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _planes: THREE.Plane[];

    isGroup: boolean;

    constructor() {
        super();

        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;
        this._clipping = false;
        this._planes = [];

        this.isGroup = true;
        this.type = "Group";
    }

    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.children.map((v, i))
        this.material.uniforms.u_clim.value.set(clim1, this.clim2);
    }
    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.material.uniforms.u_clim.value.set(this.clim1, clim2);
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.material.uniforms.u_cmdata.value = cmtextures[colormap];
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.material.uniforms.u_renderstyle.value =
            renderstyle === "mip" ? 0 : 1;
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.material.uniforms.u_renderthreshold.value = isothreshold;
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.material.clipping = clipping;
    }
    get planes() {
        return this._planes;
    }
    set planes(planes: THREE.Plane[]) {
        this._planes = planes;
        this.material.clippingPlanes = this.material.clipping ? planes : [];
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
