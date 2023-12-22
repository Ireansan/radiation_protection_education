import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { QuestionMark, Close } from "@mui/icons-material";

import { useStore } from "../../../components/store";
import * as ITEM from "./item";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/tips.module.css";

/**
 * @link https://swiperjs.com/demos#css-mode
 */
export function Tips() {
    const [set, tips] = useStore((state) => [state.set, state.tips]);

    return (
        <>
            <button
                className={`${style.tips}`}
                onClick={() => set({ tips: true })}
            >
                <QuestionMark sx={{ fontSize: 16 }} />
            </button>
            <div className={`${style.fullscreen} ${!tips && `${style.close}`}`}>
                <div className={style.foundation}>
                    <button
                        className={style.closeButton}
                        onClick={() => set({ tips: false })}
                    >
                        <Close sx={{ fontSize: 16 }} />
                    </button>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        rewind={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className={style.swiper}
                    >
                        {/* ================================================== */}
                        {/* Screen */}
                        <ITEM.ScreenStructure />
                        {/* ================================================== */}
                        {/* Canvas */}
                        <ITEM.CanvasPlayer />
                        <ITEM.CanvasShield />
                        {/* ================================================== */}
                        {/* Operation Panel */}
                        {/* -------------------------------------------------- */}
                        {/* Leva/Scene */}
                        <ITEM.LevaSceneGimmick />
                        <ITEM.LevaSceneOptions />
                        <ITEM.LevaSceneOptionsCameraControls />
                        <ITEM.LevaSceneOptionsDosimeterConfig />
                        {/* -------------------------------------------------- */}
                        {/* Leva/Player */}
                        <ITEM.LevaPlayerEquipments />
                        <ITEM.LevaPlayerHands />
                        {/* -------------------------------------------------- */}
                        {/* Leva/Data */}
                        <ITEM.LevaDataMode />
                        <ITEM.LevaDataAnimation />
                        <ITEM.LevaDataClip />
                        <ITEM.LevaDataDetail />
                    </Swiper>
                </div>
            </div>
        </>
    );
}
