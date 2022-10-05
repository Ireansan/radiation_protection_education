import { useLoader } from "@react-three/fiber";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

function volumeLoader(filepath: string | string[]): any[] {
    if (Array.isArray(filepath)) {
        return filepath.map((fp) => useLoader(NRRDLoader, fp));
    } else {
        return [() => {return useLoader(NRRDLoader, filepath)}];
    }
}

export { volumeLoader };