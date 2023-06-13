import * as THREE from "three";
import { Volume } from "three-stdlib";

import volumeShader from "../shaders/volumeShader";
import { cmtextures } from "../textures";
import { VolumeBase } from "./volumeBase";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
 * @abstract Volume Object
 * @param volume any
 * @param clim1 number, Default 0
 * @param clim2 number, Default 1
 * @param colormap string, Default viridis
 * @param renderstyle string, Default mip
 * @param isothreshold number, Default 0.1
 * @param clipping boolean, Default false
 * @param planes THREE.Plane
 */
class VolumeObject extends VolumeBase {
    volume: Volume;
    width: number;
    height: number;
    depth: number;

    isMesh: boolean;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;

    constructor(
        volume = new Volume(),
        coefficient = 1.0,
        offset = 0.0,
        opacity = 1.0,
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

        this._coefficient = coefficient;
        this._offset = offset;

        this._opacity = opacity;
        this._clim1 = clim1;
        this._clim2 = clim2;
        this._colormap = colormap;
        this._renderstyle = renderstyle;
        this._isothreshold = isothreshold;

        this._clipping = clipping;
        this._clippingPlanes = clippingPlanes;
        this._clipIntersection = clipIntersection;

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
        uniforms.u_coefficient.value = this._coefficient;
        uniforms.u_offset.value = this._offset;
        uniforms.u_opacity.value = opacity;
        uniforms.u_clim.value.set(this.clim1, this.clim2);
        uniforms.u_renderstyle.value = this.renderstyle == "mip" ? 0 : 1; // 0: MIP, 1: ISO
        uniforms.u_renderthreshold.value = this.isothreshold; // For ISO renderstyle
        uniforms.u_cmdata.value = cmtextures[this.colormap];
        this.updateMatrixWorld();
        uniforms.u_modelMatrix.value = this.matrixWorld;

        uniforms.u_clippedInitValue.value = this._clippedInitValue;
        uniforms.u_clippingPlanesRegion.value = this._clippingPlanesRegion;
        uniforms.u_clippingPlanesEnabled.value = this._clippingPlanesEnabled;
        uniforms.u_clippedInvert.value = this._clippedInvert;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: volumeShader.vertexShader,
            fragmentShader: volumeShader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
            transparent: true,
            depthTest: false,
            depthWrite: false,
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

    set coefficient(coefficient: number) {
        this._coefficient = coefficient;
        this.material.uniforms.u_coefficient.value = coefficient;
    }
    set offset(offset: number) {
        this._offset = offset;
        this.material.uniforms.u_offset.value = offset;
    }

    set opacity(opacity: number) {
        this._opacity = opacity;
        this.updateVolumeParam(false, true);
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam(false, true);
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam(false, true);
    }

    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam(false, true);
    }

    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam(false, true);
    }

    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam(false, true);
    }

    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.updateVolumeClipping(false, true);
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeClipping(false, true);
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.updateVolumeClipping(false, true);
    }

    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update this
        // ----------
        this.material.uniforms.u_opacity.value = this._opacity;
        this.material.uniforms.u_clim.value.set(this._clim1, this._clim2);
        this.material.uniforms.u_cmdata.value = cmtextures[this._colormap];
        this.material.uniforms.u_renderstyle.value =
            this._renderstyle === "mip" ? 0 : 1;
        this.material.uniforms.u_renderthreshold.value = this._isothreshold;

        // ----------
        // update parent, children
        // ----------
        super.updateVolumeParam(updateParents, updateChildren);

        // ----------
        // update this by parent
        // ----------
        const parent = this.parent;
        if (parent !== null && this.volumeParamAutoUpdate) {
            if (parent instanceof VolumeBase) {
                this.material.uniforms.u_opacity.value = parent._opacity;
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
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, this, and children
        // ----------
        super.updateVolumeClipping(updateParents, updateChildren);

        // ----------
        // update material
        // ----------
        this.material.clipping = this._clipping;
        this.material.clippingPlanes = this.material.clipping
            ? this._clippingPlanes
            : [];
        this.material.clipIntersection = this._clipIntersection;

        this.material.uniforms.u_clippedInitValue.value = this.material.clipping
            ? this._clippedInitValue
            : null;
        this.material.uniforms.u_clippingPlanesRegion.value = this.material
            .clipping
            ? this._clippingPlanesRegion
            : null;
        this.material.uniforms.u_clippingPlanesEnabled.value = this.material
            .clipping
            ? this._clippingPlanesEnabled
            : null;
        this.material.uniforms.u_clippedInvert.value = this.material.clipping
            ? this._clippedInvert
            : null;
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
