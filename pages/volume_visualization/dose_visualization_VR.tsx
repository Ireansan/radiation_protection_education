import { NextPage } from "next";
import dynamic from "next/dynamic";

import * as SCENES from "../../components/scenes";
import styles from "../../styles/threejs.module.css";

function DoseVisualizationVR() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <SCENES.XRayRoomVR />
            </div>
        </div>
    );
}

export default DoseVisualizationVR;
