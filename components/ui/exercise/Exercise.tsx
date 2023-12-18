import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import * as SCENARIOS from "./scenarios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/exercise.module.css";

export function Exercise({ ...props }) {
    const test = [
        "Slide 1",
        "Slide 2",
        "Slide 3",
        "Slide 4",
        "Slide 5",
        "Slide 6",
        "Slide 7",
        "Slide 8",
        "Slide 9",
    ];

    return (
        <>
            <div className={style.foundation}>
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className={style.swiper}
                >
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise1 />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2Preparation />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise2 />
                    </SwiperSlide>
                    <SwiperSlide className={style.swiperSlide}>
                        <SCENARIOS.Exercise3 />
                    </SwiperSlide>
                    {test.map((value, index) => (
                        <SwiperSlide
                            key={index}
                            className={style.swiperSlide}
                        >
                            {value}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}
