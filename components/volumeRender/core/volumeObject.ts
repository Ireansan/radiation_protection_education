import * as THREE from "three";
import { Volume } from "three-stdlib";

import volumeShader from "../shaders/volumeShader";
import { cmtextures } from "../textures";
import { VolumeGroup } from "./volumeGroup";

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
class VolumeObject extends THREE.Object3D {
    volume: Volume;
    width: number;
    height: number;
    depth: number;

    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];
    _clipIntersection: boolean;

    volumeParamAutoUpdate: boolean;
    volumeClippingAutoUpdate: boolean;

    volumeParamWorldAutoUpdate: boolean;
    volumeClippingWorldAutoUpdate: boolean;

    isMesh: boolean;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;

    constructor(
        volume = new Volume(),
        clim1 = 0,
        clim2 = 1,
        colormap = "viridis",
        renderstyle = "mip",
        isothreshold = 0.1,
        clipping = false,
        clippingPlanes = [],
        clipIntersection = false
    ) {
        // Init
        super();

        this.volume = volume;
        this.width = this.volume.xLength;
        this.height = this.volume.yLength;
        this.depth = this.volume.zLength;

        this._clim1 = clim1;
        this._clim2 = clim2;
        this._colormap = colormap;
        this._renderstyle = renderstyle;
        this._isothreshold = isothreshold;
        this._clipping = clipping;
        this._clippingPlanes = clippingPlanes;
        this._clipIntersection = clipIntersection;

        this.volumeParamAutoUpdate = true;
        this.volumeClippingAutoUpdate = true;

        this.volumeParamWorldAutoUpdate = true;
        this.volumeClippingWorldAutoUpdate = true;

        this.isMesh = true;

        // Texture
        const texture = new THREE.Data3DTexture(
            // @ts-ignore
            this.volume.data,
            this.width,
            this.height,
            this.depth
        );
        texture.format = THREE.RedFormat;
        texture.type = THREE.FloatType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;

        // Material
        const uniforms = THREE.UniformsUtils.clone(volumeShader.uniforms);
        uniforms.u_data.value = texture;
        uniforms.u_size.value.set(this.width, this.height, this.depth);
        uniforms.u_clim.value.set(this.clim1, this.clim2);
        uniforms.u_renderstyle.value = this.renderstyle == "mip" ? 0 : 1; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold.value = this.isothreshold; // For ISO renderstyle
        uniforms.u_cmdata.value = cmtextures[this.colormap];
        this.updateMatrixWorld();
        uniforms.u_modelMatrix.value = this.matrixWorld;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: volumeShader.vertexShader,
            fragmentShader: volumeShader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
            clipping: clipping,
            clippingPlanes: clippingPlanes,
            clipIntersection: clipIntersection,
        });

        // Geometry
        this.geometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );
        this.geometry.translate(
            this.width / 2 - 0.5,
            this.height / 2 - 0.5,
            this.depth / 2 - 0.5
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
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.material.clippingPlanes = this.material.clipping ? planes : [];
        this.updateVolumeClipping(false, true);
    }
    get clipIntersection() {
        return this._clipIntersection;
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.material.clipIntersection = clipIntersection;
        this.updateVolumeClipping(false, true);
    }

    // FIXME:
    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeParamWorldAutoUpdate
        ) {
            if (parent instanceof VolumeObject) {
                parent.updateVolumeParam(true, false);
            }
        }

        if (parent !== null && this.volumeParamAutoUpdate) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                this._clim1 = parent._clim1;
                this._clim2 = parent._clim2;
                this._colormap = parent._colormap;
                this._renderstyle = parent._renderstyle;
                this._isothreshold = parent._isothreshold;

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
            }
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeObject &&
                    child.volumeParamWorldAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeClippingWorldAutoUpdate
        ) {
            if (parent instanceof VolumeObject) {
                parent.updateVolumeClipping(true, false);
            }
        }

        // update this
        // FIXME:
        if (parent !== null && this.volumeClippingAutoUpdate) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                this._clipping = parent._clipping;
                this._clippingPlanes = parent._clipping
                    ? parent._clippingPlanes
                    : [];
                this._clipIntersection = parent._clipIntersection;

                this.material.clipping = parent._clipping;
                this.material.clippingPlanes = this.material.clipping
                    ? parent._clippingPlanes
                    : null;
                this.material.clipIntersection = parent._clipIntersection;
            }
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeObject &&
                    child.volumeClippingWorldAutoUpdate === true
                ) {
                    child.updateVolumeClipping(false, true);
                }
            }
        }
    }

    /**
     *
     * @param position world position
     * @returns value in the data array
     */
    getVolumeValue(position: THREE.Vector3): number {
        const localPosition = this.worldToLocal(position);

        if (
            localPosition.x < 0 ||
            this.volume.xLength <= localPosition.x ||
            localPosition.y < 0 ||
            this.height <= localPosition.y ||
            localPosition.z < 0 ||
            this.volume.zLength <= localPosition.z
        ) {
            return NaN;
        }

        // https://github.com/mrdoob/three.js/blob/cba85c5c6318e7ca53dd99f9f3c25eb3b79d9693/examples/jsm/misc/Volume.js#L211
        return this.volume.getData(
            Math.trunc(localPosition.x),
            Math.trunc(localPosition.y),
            Math.trunc(localPosition.z)
        );
    }
}

export { VolumeObject };
