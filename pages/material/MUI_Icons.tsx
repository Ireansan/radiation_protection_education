import {
    Shield,
    HealthAndSafety,
    SignLanguage,
    HowToReg,
    Person,
    PersonAdd,
    PersonAddAlt1,
    Transcribe,
    Visibility,
    VisibilityOff,
    Sick,
    // BackHand
} from "@mui/icons-material";
import { useControls, folder, button } from "leva";

function MUIIcons() {
    const color = "#D4875D";
    const [icon] = useControls(() => ({
        type: {
            options: ["Shield", "Goggle", "Neck Guard", "Apron", "Glove"],
            label: "Icon",
        },
    }));

    return (
        <>
            <div style={{ left: "10px", top: "10px", position: "absolute" }}>
                {icon.type === "Shield" ? (
                    <HealthAndSafety sx={{ color: color, fontSize: "3rem" }} />
                ) : null}
                {icon.type === "Goggle" ? (
                    <Visibility sx={{ color: color, fontSize: "3rem" }} />
                ) : null}
                {icon.type === "Neck Guard" ? (
                    <PersonAddAlt1 sx={{ color: color, fontSize: "3rem" }} />
                ) : null}
                {icon.type === "Apron" ? (
                    <Person sx={{ color: color, fontSize: "3rem" }} />
                ) : null}
                {icon.type === "Glove" ? (
                    <SignLanguage sx={{ color: color, fontSize: "3rem" }} />
                ) : null}
            </div>
        </>
    );
}

export default MUIIcons;
