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
                onClick={() => {
                    set({ tips: true });

                    set((state) => ({
                        sceneStates: {
                            ...state.sceneStates,
                            executeLog: {
                                ...state.sceneStates.executeLog,
                                tips: {
                                    ...state.sceneStates.executeLog.tips,
                                    open: true,
                                },
                            },
                        },
                    }));
                }}
            >
                <QuestionMark sx={{ fontSize: 16 }} />
            </button>
            <div className={`${style.fullscreen} ${!tips && `${style.close}`}`}>
                <div className={style.foundation}>
                    <button
                        className={style.closeButton}
                        onClick={() => {
                            set({ tips: false });

                            set((state) => ({
                                sceneStates: {
                                    ...state.sceneStates,
                                    executeLog: {
                                        ...state.sceneStates.executeLog,
                                        tips: {
                                            ...state.sceneStates.executeLog
                                                .tips,
                                            close: true,
                                        },
                                    },
                                },
                            }));
                        }}
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
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenStructure />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.Screen3DSpace />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenOperationPanel />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter1 />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter2 />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.ScreenUIDosimeter3 />
                        </SwiperSlide>
                        {/* ================================================== */}
                        {/* Scene Object */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectManual />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectPlayer />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectShield />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectClip1 />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.SceneObjectClip2 />
                        </SwiperSlide>
                        {/* ================================================== */}
                        {/* Operation Panel */}
                        {/* -------------------------------------------------- */}
                        {/* Leva/Scene */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneGimmickXRay />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneGimmickCArm />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptions />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsCameraControlsSettings />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaSceneOptionsDosimeterSettings />
                        </SwiperSlide>
                        {/* -------------------------------------------------- */}
                        {/* Leva/Player */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaPlayerEquipments />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaPlayerHands />
                        </SwiperSlide>
                        {/* -------------------------------------------------- */}
                        {/* Leva/Data */}
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataMode />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataAnimation />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataClip />
                        </SwiperSlide>
                        <SwiperSlide className={style.swiperSlide}>
                            <ITEM.LevaDataDetail />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    );
}
