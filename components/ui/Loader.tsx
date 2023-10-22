import { Html, useProgress } from "@react-three/drei";

/**
 * @link https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models#showing-a-loader
 */

export function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
}
