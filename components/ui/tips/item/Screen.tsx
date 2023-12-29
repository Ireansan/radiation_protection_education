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

import { TipsItem } from "./TipsItemTemplate";
import { applyBasePath } from "../../../../utils";
import type { TipsBaseProps } from "./TipsItemTemplate";

export function ScreenStructure({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={"/img/manual/experiment/01/png/All/screen_all.png "}
                imgAlt={"img/Screen"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen</h3>
                        <p>
                            The screen structure of this material is divided
                            into three main sections.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function Screen3DSpace({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem>
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen - 3D Space</h3>
                        <p>
                            Dose distribution data, 3D objects as players, and{" "}
                            protective boards are displayed.
                        </p>
                        <p>
                            The{" "}
                            <a href="https://threejs.org/docs/#examples/en/controls/OrbitControls">
                                OrbitControls
                            </a>{" "}
                            controller is used to control the camera.
                        </p>
                        <ul>
                            <li>Drag the left button: Rotate</li>
                            <li>Right button drag: Pan</li>
                            <li>Mouse wheel: Zoom</li>
                        </ul>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function ScreenOperationPanel({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem>
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen - Operation Panel</h3>
                        <p>
                            The panel allows manipulation of dose distribution
                            data, dosimeter UI, and numerical values related to
                            the entire 3D space, etc.
                        </p>
                        <p>
                            Detailed information is provided in the operation
                            manual.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function ScreenUIDosimeter1({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/UI/DosimeterUI/Dosimeter.png"
                }
                imgAlt={"img/UI/DosimeterUI"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen - Dosimeter (1/3)</h3>
                        <p>
                            The exposure dose is obtained from a virtual
                            dosimeter tied to the player and displayed.
                        </p>
                        <p>
                            The left side shows the annual upper limit exposure
                            dose (20,000[&micro;Sv]), and the right side shows
                            the exposure dose against the target upper limit
                            exposure dose per exposure.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function ScreenUIDosimeter2({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/UI/DosimeterUI/Dosimeter_all-icon.png"
                }
                imgAlt={"img/UI/DosimeterUIIcon"}
            >
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen - Dosimeter (2/3)</h3>
                        <p>
                            If the exposure dose is affected by protective
                            equipment or protective plates in addition to the
                            exposure dose, the corresponding icon will be
                            displayed.
                        </p>
                        <p>
                            In the present teaching material, the exposure dose
                            is set to 0.1 times for protective equipment and
                            0.01 times for protective plates.
                            <br />
                            (All protective equipment is assumed to be 0.1 times
                            the dose, regardless of type.)
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

export function ScreenUIDosimeter3({ isEnglish = false }: TipsBaseProps) {
    const color = "#D4875D"; // Orange
    const fontSize = "2rem";
    const iconStyle = {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    };

    return (
        <>
            <TipsItem>
                {!isEnglish ? (
                    <></>
                ) : (
                    <>
                        <h3>Screen - Dosimeter (2/3)</h3>
                        <p>The types of icons are as follows</p>
                        <table>
                            <tr>
                                <th>Category</th>
                                <th>Icon</th>
                            </tr>
                            <tr>
                                <td>Shield</td>
                                <td>
                                    <HealthAndSafety
                                        sx={{
                                            color: color,
                                            fontSize: fontSize,
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Goggle</td>
                                <td>
                                    <Visibility
                                        sx={{
                                            color: color,
                                            fontSize: fontSize,
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Neck Guard</td>
                                <td>
                                    <PersonAddAlt1
                                        sx={{
                                            color: color,
                                            fontSize: fontSize,
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Apron</td>
                                <td>
                                    <Person
                                        sx={{
                                            color: color,
                                            fontSize: fontSize,
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Glove</td>
                                <td>
                                    <SignLanguage
                                        sx={{
                                            color: color,
                                            fontSize: fontSize,
                                        }}
                                    />
                                </td>
                            </tr>
                        </table>
                    </>
                )}
            </TipsItem>
        </>
    );
}
