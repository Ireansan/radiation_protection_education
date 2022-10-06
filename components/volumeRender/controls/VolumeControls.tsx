import React from "react";
import { useControls, folder } from "leva";

import { volumeStore } from "../stores";

/**
 * @function VolumeControls
 * @abstract
 */
function VolumeControls() {
    const setClim1 = volumeStore((state) => state.setClim1);
    const setClim2 = volumeStore((state) => state.setClim2);
    const setColormap = volumeStore((state) => state.setColormap);
    const setRenderstyle = volumeStore((state) => state.setRenderstyle);
    const setIsothreshold = volumeStore((state) => state.setIsothreshold);
    const [volumeConfig, volumeSet] = useControls(() => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                setClim1(e);
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                setClim2(e);
            },
        },
        colormap: {
            options: ["viridis", "gray"],
            onChange: (e) => {
                if (e === "viridis") {
                    setColormap(0);
                } else if (e === "gray") {
                    setColormap(1);
                }
            },
        },
        renderstyle: {
            options: ["iso", "mip"],
            onChange: (e) => {
                setRenderstyle(e);
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            // max: 100,
            onChange: (e) => {
                setIsothreshold(e);
            },
        },
    }));

    return <>{}</>;
}

export default VolumeControls;
