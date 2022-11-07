import { NextPage, GetStaticProps } from "next";
import dynamic from "next/dynamic";

import * as SCENES from "../../components/scenes";

import styles from "../../styles/threejs.module.css";

const Box = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <boxGeometry />
            </mesh>
        </>
    );
};

function DoseVisualization() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <SCENES.XRayRoom />
            </div>
        </div>
    );
}

export default DoseVisualization;
