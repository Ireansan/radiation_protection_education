import { NextPage, GetStaticProps } from "next";
import dynamic from "next/dynamic";

import XRayRoomBoardPrototype from "../../components/scenes/XRay_room_Board_Prototype";

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
                <XRayRoomBoardPrototype />
            </div>
        </div>
    );
}

export default DoseVisualization;
