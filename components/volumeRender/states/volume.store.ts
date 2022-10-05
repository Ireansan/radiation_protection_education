import create from "zustand";
import * as THREE from "three";

interface VolumeStates {
    position: THREE.Vector3;
    setPosition: (position: THREE.Vector3) => void;
    rotation: THREE.Euler;
    setRotation: (rotation: THREE.Euler) => void;
    scale: THREE.Vector3;
    setScale: (scale: THREE.Vector3) => void;
    clim1: number;
    setClim1: (clim1: number) => void;
    clim2: number;
    setClim2: (clim2: number) => void;
    cmtextures: THREE.Texture[];
    setCmtextures: (cmtextures: THREE.Texture[]) => void;
    colormap: number;
    setColormap: (colormap: number) => void;
    renderstyle: string;
    setRenderstyle: (renderstyle: string) => void;
    isothreshold: number;
    setIsothreshold: (isothreshold: number) => void;
}
const volumeStore = create<VolumeStates>((set, get) => ({
    position: new THREE.Vector3(0, 0, 0),
    setPosition: (position: THREE.Vector3) => {
        set((state) => ({ position: position }));
    },
    rotation: new THREE.Euler(0, 0, 0),
    setRotation: (rotation: THREE.Euler) => {
        set((state) => ({ rotation: rotation }));
    },
    scale: new THREE.Vector3(1, 1, 1),
    setScale: (scale: THREE.Vector3) => {
        set((state) => ({ scale: scale }));
    },
    clim1: 0,
    setClim1: (clim1: number) => {
        set((state) => ({ clim1: clim1 }));
    },
    clim2: 1,
    setClim2: (clim2: number) => {
        set((state) => ({ clim2: clim2 }));
    },
    cmtextures: [],
    setCmtextures: (cmtextures: THREE.Texture[]) => {
        set((state) => ({ cmtextures: cmtextures }));
    },
    colormap: 0,
    setColormap: (colormap: number) => {
        set((state) => ({ colormap: colormap }));
    },
    renderstyle: "iso",
    setRenderstyle: (renderstyle: string) => {
        set((state) => ({ renderstyle: renderstyle }));
    },
    isothreshold: 0.15,
    setIsothreshold: (isothreshold: number) => {
        set((state) => ({ isothreshold: isothreshold }));
    },
}));

export { volumeStore };
