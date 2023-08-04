import * as THREE from "three";
import { Volume } from "three-stdlib";

import doseShader from "../shaders/doseShader";
import { cmtextures } from "../textures";
import { VolumeObject } from "./volumeObject";

class DoseObject extends VolumeObject {
    _clippingPlanesIsBoard: boolean[];

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
        super(
            volume,
            coefficient,
            offset,
            opacity,
            clim1,
            clim2,
            colormap,
            renderstyle,
            isothreshold,
            clipping,
            clippingPlanes,
            clipIntersection
        );

        this._clippingPlanesIsBoard = [];

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
        const uniforms = THREE.UniformsUtils.clone(doseShader.uniforms);
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
        uniforms.u_clippingPlanesIsBoard.value = this._clippingPlanesIsBoard;
        uniforms.u_clippedInvert.value = this._clippedInvert;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: doseShader.vertexShader,
            fragmentShader: doseShader.fragmentShader,
            side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
            transparent: true,
            depthTest: false,
            depthWrite: false,
            clipping: clipping,
            clippingPlanes: clippingPlanes,
            clipIntersection: clipIntersection,
        });
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, this, and children
        // ----------
        super.updateVolumeClipping(updateParents, updateChildren);

        // ----------
        // reset this isBoard values
        // ----------
        this._clippingPlanesIsBoard = [];

        // ----------
        // update this isBoard
        // ----------
        let isBoardArray = new Array(this.planesLength).fill(false);
        this._clippingPlanesIsBoard =
            this._clippingPlanesIsBoard.concat(isBoardArray);

        for (let i = 0; i < this.totalClippingPlanesObjects.length; i++) {
            let element = this.totalClippingPlanesObjects[i];

            this._clippingPlanesIsBoard[i] = element.isType === "board";
        }

        // ----------
        // update material to apply isBoard
        // ----------
        this.material.uniforms.u_clippingPlanesIsBoard.value = this.material
            .clipping
            ? this._clippingPlanesIsBoard
            : null;
    }

    getVolumeValue(position: THREE.Vector3): number {
        let boards = this.totalClippingPlanesObjects.filter(
            (element) => element.isType === "board"
        );

        const XOR = (a: boolean, b: boolean) => {
            return (a || b) && !(a && b);
        };

        // if clipped, retrun NaN
        let planes: THREE.Plane[];
        let board;
        let guarded = false;
        for (let i = 0; i < boards.length; i++) {
            board = boards[i];
            planes = board.planes;

            let plane: THREE.Plane;
            let tmpGuarded = true;
            for (let j = 0; j < planes.length; j++) {
                plane = planes[j];

                let normal = plane.normal.clone().multiplyScalar(-1);

                tmpGuarded =
                    tmpGuarded && position.dot(normal) > plane.constant;
            }
            tmpGuarded = XOR(tmpGuarded, board.invert);

            guarded = guarded || tmpGuarded;
        }

        let coefficient = guarded ? this._coefficient : 1.0;
        let offset = guarded ? this._offset : 0.0;

        return coefficient * super.getVolumeValue(position) + offset;
    }
}

export { DoseObject };
