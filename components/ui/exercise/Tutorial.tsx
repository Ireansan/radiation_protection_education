import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import { useStore } from "../../store";
import * as TUTORIALS from "./scenarios/tutorials";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/exercise.module.css";

export function Tutorial() {
    const [debug] = useStore((state) => [state.debug]);

    return (
        <>
            <div className={style.foundation}>
                <Swiper
                    navigation={debug}
                    mousewheel={true}
                    modules={[Navigation, Mousewheel]}
                    className={style.swiper}
                >
                    {/* ================================================== */}
                    {/* Leva */}
                    {/* -------------------------------------------------- */}
                    {/* Scene */}
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.SceneGimmickXRay />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.SceneGimmickCArm />
                    </SwiperSlide>
                    {/* -------------------------------------------------- */}
                    {/* Player */}
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.PlayerEquipmetns />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.PlayerHand />
                    </SwiperSlide>
                    {/* -------------------------------------------------- */}
                    {/* Data */}
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.DataMode />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.DataClip />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.DataAnimation />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.DataDetail />
                    </SwiperSlide>
                    {/* ================================================== */}
                    {/* 3D Space */}
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.SceneObjectsPlayer />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <TUTORIALS.SceneObjectsShield />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}
