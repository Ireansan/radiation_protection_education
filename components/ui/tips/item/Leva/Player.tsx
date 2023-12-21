import { TipsItem } from "../TipsItemTemplate";

export function LevaPlayerEquipments({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                }
                imgAlt={"img/leva/Player/Equipments"}
            >
                <h3>Operation panel - Player/Equipments</h3>
                <p>
                    You can select whether or not you are equipped with{" "}
                    radiation protection equipment.
                </p>
                <p>
                    By activating the equipment, the dosimeter UI displays icons{" "}
                    according to the type and the exposure dose.
                </p>
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaPlayerHands({ ...props }) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                }
                imgAlt={"img/leva/Player/Equipments"}
            >
                <h3>Operation panel - Player/Equipments</h3>
                <p>
                    You can select whether or not you are equipped with{" "}
                    radiation protection equipment.
                </p>
                <p>
                    By activating the equipment, the dosimeter UI displays icons{" "}
                    according to the type and the exposure dose.
                </p>
            </TipsItem>
        </>
    );
}
