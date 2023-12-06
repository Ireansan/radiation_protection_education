import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import { useStore } from "../../../components/store";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import style from "../../../styles/css/tips.module.css";

/**
 * @link https://swiperjs.com/demos#css-mode
 */
export function Tips() {
    const [tips] = useStore((state) => [state.tips]);

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
            <div className={`${tips ? `${style.fullscreen}` : ``}`}>
                <div className={style.foundation}>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className={style.swiper}
                    >
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
