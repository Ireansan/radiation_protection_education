import { useStore } from "../../store";

export function DosimeterDisplayUI({ ...props }) {
    const [sceneProperties] = useStore((state) => [state.sceneProperties]);
    const { dosimeterResults } = sceneProperties;

    return (
        <>
            <div
                id={"DosimeterDisplayUI"}
                style={{
                    bottom: "5px",
                    left: "50px",
                    width: "200px",
                }}
            >
                <h2>{JSON.stringify(dosimeterResults)}</h2>
            </div>
        </>
    );
}
