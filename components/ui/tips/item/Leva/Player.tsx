import { TipsItem } from "../TipsItemTemplate";
import type { TipsBaseProps } from "../TipsItemTemplate";

export function LevaPlayerEquipments({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                imgSrc={
                    "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                }
                imgAlt={"img/leva/Player/Equipments"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Player/Equipments</h3>
                        <p>放射線防護具の装備の有無を選択できます。</p>
                        <p>
                            装備を有効にすることで，線量計UIに種類に応じたアイコンが表示され，被ばく量が変化します。
                        </p>
                    </>
                ) : (
                    <>
                        <h3>Operation panel - Player/Equipments</h3>
                        <p>
                            You can select whether or not you are equipped with{" "}
                            radiation protection equipment.
                        </p>
                        <p>
                            By activating the equipment, the dosimeter UI
                            displays icons according to the type and the
                            exposure dose.
                        </p>
                    </>
                )}
            </TipsItem>
        </>
    );
}

// FIXME:
export function LevaPlayerHands({ isEnglish = false }: TipsBaseProps) {
    return (
        <>
            <TipsItem
                // imgSrc={
                //     "/img/manual/experiment/01/png/leva/Player/Equipments.png"
                // }
                imgAlt={"img/leva/Player/Hands"}
            >
                {!isEnglish ? (
                    <>
                        <h3>操作パネル - Player/Hands</h3>
                        <p></p>
                    </>
                ) : (
                    <>
                        <h3>Operation panel - Player/Hands</h3>
                        <p></p>
                    </>
                )}
            </TipsItem>
        </>
    );
}
