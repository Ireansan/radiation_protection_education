import { NextPage, GetStaticProps } from "next";
import dynamic from "next/dynamic";

import XRayRoomBoard from "../../components/scenes/XRay_room_Board";

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
                <XRayRoomBoard />
            </div>
        </div>
    );
}

export default DoseVisualization;
