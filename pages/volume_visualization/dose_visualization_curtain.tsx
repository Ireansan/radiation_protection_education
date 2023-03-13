import { NextPage, GetStaticProps } from "next";
import dynamic from "next/dynamic";

import * as SCENES from "../../components/scenes";

import styles from "../../styles/threejs.module.css";

function DoseVisualizationCurtain() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <SCENES.XRayCurtain />
            </div>
        </div>
    );
}

export default DoseVisualizationCurtain;
