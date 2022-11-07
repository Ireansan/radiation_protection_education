import { GameTemplate } from "../../components/game_template";
import styles from "../../styles/threejs.module.css";

export default function App() {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <GameTemplate />
            </div>
        </div>
    );
}
