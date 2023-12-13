import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { QuestionMark, Close } from "@mui/icons-material";

import { useStore } from "../../../components/store";
import Test_1 from "./Test_1.mdx";

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
            <button
                className={`${style.tips}`}
                onClick={() => set({ tips: true })}
            >
                <QuestionMark />
            </button>
            <div className={`${style.fullscreen} ${!tips && `${style.close}`}`}>
                <div className={style.foundation}>
                    <button onClick={() => set({ tips: false })}>
                        <Close />
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
                        <SwiperSlide>
                            <Test_1 />
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
            </div>
        </>
    );
}
