import * as THREE from "three";
import { Volume } from "three-stdlib";

import volumeRenderShader from "../shaders/volumeShader";
import { cmtextures } from "../textures";
import { VolumeGroup } from "./VolumeGroup";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
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
export class VolumeObject extends THREE.Object3D {
    volume: Volume;

    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _planes: THREE.Plane[];

    volumeParamAutoUpdate: boolean;

    isMesh: boolean;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;

    constructor(volume = new Volume()) {
        // Init
        super();

        this.volume = volume;
        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;
        this._clipping = false;
        this._planes = [];

        this.volumeParamAutoUpdate = true;

        this.isMesh = true;

        // Texture
        const texture = new THREE.Data3DTexture(
            // @ts-ignore
            this.volume.data,
            this.volume.xLength,
            this.volume.yLength,
            this.volume.zLength
        );
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        // Material
        const uniforms = THREE.UniformsUtils.clone(volumeRenderShader.uniforms);
        uniforms.u_data.value = texture;
        uniforms.u_size.value.set(
            this.volume.xLength,
            this.volume.yLength,
            this.volume.zLength
        );
        uniforms.u_clim.value.set(this.clim1, this.clim2);
        uniforms.u_renderstyle.value = this.renderstyle == "mip" ? 0 : 1; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold.value = this.isothreshold; // For ISO renderstyle
        uniforms.u_cmdata.value = cmtextures[this.colormap];

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: volumeRenderShader.vertexShader,
            fragmentShader: volumeRenderShader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
        });

        // Geometry
        this.geometry = new THREE.BoxGeometry(
            this.volume.xLength,
            this.volume.yLength,
            this.volume.zLength
        );
        this.geometry.translate(
            this.volume.xLength / 2 - 0.5,
            this.volume.yLength / 2 - 0.5,
            this.volume.zLength / 2 - 0.5
        );
    }

    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.material.uniforms.u_clim.value.set(clim1, this.clim2);
        this.updateVolumeParam(false, true);
    }
    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.material.uniforms.u_clim.value.set(this.clim1, clim2);
        this.updateVolumeParam(false, true);
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.material.uniforms.u_cmdata.value = cmtextures[colormap];
        this.updateVolumeParam(false, true);
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.material.uniforms.u_renderstyle.value =
            renderstyle === "mip" ? 0 : 1;
        this.updateVolumeParam(false, true);
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.material.uniforms.u_renderthreshold.value = isothreshold;
        this.updateVolumeParam(false, true);
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.material.clipping = clipping;
        this.updateVolumeParam(false, true);
    }
    get planes() {
        return this._planes;
    }
    set planes(planes: THREE.Plane[]) {
        this._planes = planes;
        this.material.clippingPlanes = this.material.clipping ? planes : [];
        this.updateVolumeParam(false, true);
    }

    // FIXME:
    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (updateParents === true) {
            if (
                parent !== null &&
                parent instanceof VolumeObject &&
                parent.volumeParamAutoUpdate === true
            ) {
                parent.updateVolumeParam(true, false);
            }
        }

        if (
            parent !== null &&
            (parent instanceof VolumeObject || parent instanceof VolumeGroup)
        ) {
            this._clim1 = parent._clim1;
            this._clim2 = parent._clim2;
            this._colormap = parent._colormap;
            this._renderstyle = parent._renderstyle;
            this._isothreshold = parent._isothreshold;
            this._clipping = parent._clipping;
            this._planes = parent._clipping ? parent._planes : [];

            this.material.uniforms.u_clim.value.set(
                parent._clim1,
                parent._clim2
            );
            this.material.uniforms.u_cmdata.value =
                cmtextures[parent._colormap];
            this.material.uniforms.u_renderstyle.value =
                parent._renderstyle === "mip" ? 0 : 1;
            this.material.uniforms.u_renderthreshold.value =
                parent._isothreshold;
            this.material.clipping = parent._clipping;
            this.material.clippingPlanes = this.material.clipping
                ? parent._planes
                : [];
            console.log("object updateVolumeParam", this.material.clippingPlanes);
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeObject &&
                    child.volumeParamAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }
}
