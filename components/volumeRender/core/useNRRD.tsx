/**
 * @link https://github.com/pmndrs/drei/blob/06ee2d9b877b7d75cc3fb2fc3b77a0a7b36a7796/src/core/useGLTF.tsx
 */

import { Loader } from "three";
// @ts-ignore
// import { NRRDLoader, NRRD } from "three-stdlib";
import { Volume } from "three-stdlib";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
import { useLoader } from "@react-three/fiber";

function extensions(extendLoader?: (loader: NRRDLoader) => void) {
    return (loader: Loader) => {
        if (extendLoader) {
            extendLoader(loader as unknown as NRRDLoader);
        }
    };
}

export function useNRRD<T extends string | string[]>(
    path: T,
    extendLoader?: (loader: NRRDLoader) => void
) {
    const nrrd = useLoader<Volume, T>(
        NRRDLoader,
        path,
        extensions(extendLoader)
    );
    console.log("nrrd", nrrd);
    return nrrd;
}

useNRRD.preload = (
    path: string | string[],
    extendLoader?: (loader: NRRDLoader) => void
) => {
    console.log("preload");
    return useLoader.preload(NRRDLoader, path, extensions(extendLoader));
};
/*
useGLTF.clear = (input: string | string[]) =>
    useLoader.clear(NRRDLoader, input);
*/
