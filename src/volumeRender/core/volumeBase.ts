import * as THREE from "three";

class ClippingPlanesObject {
    id: number;
    planes: THREE.Plane[];
    enabled: boolean;
    intersection: boolean;
    invert: boolean;
    isType?: string;

    constructor(
        id: number,
        planes: THREE.Plane[],
        enabled: boolean,
        intersection: boolean,
        invert: boolean,
        isType?: string
    ) {
        this.id = id;
        this.planes = planes;
        this.enabled = enabled;
        this.intersection = intersection;
        this.invert = invert;
        isType ? (this.isType = isType) : null;
    }
}

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
 * @abstract Volume Base
 */
class VolumeBase extends THREE.Object3D {
    _coefficient: number; // multiply coefficient and volume.data
    _offset: number; // add offset and volume.data

    _opacity: number;
    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;

    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];
    _clipIntersection: boolean;

    _clippedInitValue: boolean[];
    _clippingPlanesRegion: number[];
    _clippingPlanesEnabled: boolean[];
    _clippedInvert: boolean[];
    // -> [...parent.ClippingPlanesObject[], ...this.ClippingPlanesObject[]]

    parentId: string | undefined;
    parentRegionOffset: number;
    planesLength: number;
    clippingPlanesObjects: ClippingPlanesObject[];
    totalClippingPlanesObjects: ClippingPlanesObject[];

    volumeParamAutoUpdate: boolean;
    volumeClippingAutoUpdate: boolean;

    volumeParamWorldAutoUpdate: boolean;
    volumeClippingWorldAutoUpdate: boolean;

    constructor() {
        super();

        this._coefficient = 1.0;
        this._offset = 0.0;

        this._opacity = 1.0;
        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;

        this._clipping = false;
        this._clippingPlanes = [];
        this._clipIntersection = false;

        this._clippedInitValue = [];
        this._clippingPlanesRegion = [];
        this._clippingPlanesEnabled = [];
        this._clippedInvert = [];

        this.parentRegionOffset = 0;
        this.planesLength = 0;
        this.clippingPlanesObjects = [];
        this.totalClippingPlanesObjects = [];

        this.volumeParamAutoUpdate = true;
        this.volumeClippingAutoUpdate = true;

        this.volumeParamWorldAutoUpdate = true;
        this.volumeClippingWorldAutoUpdate = true;
    }

    get coefficient() {
        return this._coefficient;
    }
    set coefficient(coefficient: number) {
        this._coefficient = coefficient;
    }
    get offset() {
        return this._offset;
    }
    set offset(offset: number) {
        this._offset = offset;
    }

    get opacity() {
        return this._opacity;
    }
    set opacity(opacity: number) {
        this._opacity = opacity;
        this.updateVolumeParam(false, true);
    }
    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam(false, true);
    }
    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam(false, true);
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam(false, true);
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam(false, true);
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam(false, true);
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeClipping(false, true);
    }
    get clipIntersection() {
        return this._clipIntersection;
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.updateVolumeClipping(false, true);
    }

    get clippedInitValue() {
        return this._clippedInitValue;
    }
    set clippedInitValue(initValues: boolean[]) {
        this._clippedInitValue = initValues;
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanesRegion() {
        return this._clippingPlanesRegion;
    }
    set clippingPlanesRegion(planesRegion: number[]) {
        this._clippingPlanesRegion = planesRegion;
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanesEnabled() {
        return this._clippingPlanesEnabled;
    }
    set clippingPlanesEnabled(planesEnabled: boolean[]) {
        this._clippingPlanesEnabled = planesEnabled;
        this.updateVolumeClipping(false, true);
    }
    get clippedInvert() {
        return this._clippedInvert;
    }
    set clippedInvert(invert: boolean[]) {
        this._clippedInvert = invert;
        this.updateVolumeClipping(false, true);
    }

    pushClippingPlanesObjects(
        planes: THREE.Plane[],
        clipping: boolean = false,
        intersection: boolean = false,
        invert: boolean = false,
        isType?: string
    ) {
        let index = this.clippingPlanesObjects.length;
        this.clippingPlanesObjects.push(
            new ClippingPlanesObject(
                index,
                planes,
                clipping,
                intersection,
                invert,
                isType
            )
        );
        this.updateVolumeClipping(false, true);
    }
    setClippingPlanesObjects(
        id: number,
        clipping?: boolean,
        planes?: THREE.Plane[],
        intersection?: boolean,
        invert?: boolean,
        isType?: string
    ) {
        clipping !== undefined
            ? (this.clippingPlanesObjects[id].enabled = clipping)
            : null;
        planes !== undefined
            ? (this.clippingPlanesObjects[id].planes = planes)
            : null;
        intersection !== undefined
            ? (this.clippingPlanesObjects[id].intersection = intersection)
            : null;
        invert !== undefined
            ? (this.clippingPlanesObjects[id].invert = invert)
            : null;
        isType !== undefined
            ? (this.clippingPlanesObjects[id].isType = isType)
            : null;
        this.updateVolumeClipping(false, true);
    }

    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeParamWorldAutoUpdate
        ) {
            if (parent instanceof VolumeBase) {
                parent.updateVolumeParam(true, false);
            }
        }

        // update this by parent
        if (parent !== null && this.volumeParamAutoUpdate) {
            if (parent instanceof VolumeBase) {
                this._opacity = parent._opacity;
                this._clim1 = parent._clim1;
                this._clim2 = parent._clim2;
                this._colormap = parent._colormap;
                this._renderstyle = parent._renderstyle;
                this._isothreshold = parent._isothreshold;
            }
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeBase &&
                    child.volumeParamWorldAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent
        // ----------
        const parent = this.parent;
        if (
            updateParents &&
            parent !== null &&
            this.volumeClippingWorldAutoUpdate
        ) {
            if (parent instanceof VolumeBase) {
                parent.updateVolumeClipping(true, false);
            }
        }

        // ----------
        // reset this values
        // ----------
        this.planesLength = 0;
        this.parentRegionOffset = 0;

        this._clipping = false;
        this._clippingPlanes = [];
        this._clipIntersection = false;

        this._clippedInitValue = [];
        this._clippingPlanesEnabled = [];
        this._clippingPlanesRegion = [];
        this._clippedInvert = [];

        this.totalClippingPlanesObjects = [];

        // ----------
        // update this by parent
        // ----------
        if (
            parent !== null &&
            this.volumeClippingAutoUpdate &&
            parent instanceof VolumeBase
        ) {
            this._clipping = parent._clipping;
            this._clippingPlanes = parent._clipping
                ? parent._clippingPlanes.concat()
                : [];
            this._clipIntersection = parent._clipIntersection;

            this._clippedInitValue = parent._clipping
                ? parent._clippedInitValue.concat()
                : [];
            this._clippingPlanesRegion = parent._clipping
                ? parent._clippingPlanesRegion.concat()
                : [];
            this._clippingPlanesEnabled = parent._clipping
                ? parent._clippingPlanesEnabled.concat()
                : [];
            this._clippedInvert = parent._clipping
                ? parent._clippedInvert.concat()
                : [];

            this.totalClippingPlanesObjects = parent._clipping
                ? parent.totalClippingPlanesObjects.concat()
                : [];

            this.parentRegionOffset = parent._clipping
                ? parent.clippingPlanesRegion.reduce(
                      (a, b) => Math.max(a, b),
                      -1
                  ) + 1
                : 0;
        }

        // ----------
        // update this
        // ----------
        for (let i = 0; i < this.clippingPlanesObjects.length; i++) {
            let element = this.clippingPlanesObjects[i];

            // Clipping
            this._clipping = this._clipping || element.enabled;

            // Planes
            this._clippingPlanes = this._clippingPlanes.concat(element.planes);
            this.planesLength += element.planes.length;

            // Intersection
            this._clipIntersection =
                this._clipIntersection || element.intersection;

            // Enabled
            let enabledArray = new Array(element.planes.length).fill(
                element.enabled
            );
            this._clippingPlanesEnabled =
                this._clippingPlanesEnabled.concat(enabledArray);

            // Region
            let regionArray = new Array(element.planes.length).fill(
                i + this.parentRegionOffset
            );
            this._clippingPlanesRegion =
                this._clippingPlanesRegion.concat(regionArray);
        }

        // Init Value
        let initValueArray = new Array(this.planesLength).fill(false);
        this._clippedInitValue = this._clippedInitValue.concat(initValueArray);

        for (let i = 0; i < this.parentRegionOffset; i++) {
            this._clippedInitValue[i] = this._clipIntersection;
        }

        // Invert
        let invertArray = new Array(this.planesLength).fill(false);
        this._clippedInvert = this._clippedInvert.concat(invertArray);

        // set Init Value, Invert
        for (let i = 0; i < this.clippingPlanesObjects.length; i++) {
            let element = this.clippingPlanesObjects[i];

            this._clippedInitValue[i + this.parentRegionOffset] =
                this._clipIntersection && element.enabled;
            this._clippedInvert[i + this.parentRegionOffset] =
                element.invert && element.enabled;
        }

        this.totalClippingPlanesObjects =
            this.totalClippingPlanesObjects.concat(this.clippingPlanesObjects);

        // ----------
        // update children
        // ----------
        if (updateChildren) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeBase &&
                    child.volumeClippingWorldAutoUpdate
                ) {
                    child.updateVolumeClipping(false, true);
                }
            }
        }
    }
}

export { VolumeBase };
