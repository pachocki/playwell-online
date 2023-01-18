import React from "react";
//React router
import { Link } from "react-router-dom";
//Component
import Header from "../../../../components/header/Header";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "../../../../styles.css";

//Data
import { CoursesDescriptionsMobile } from "../../../../data/Data";

const AboutCoursesMobile = () => {
  return (
    <div className="hidden screen:block px-10 screen:px-2 small-mobile:pt-10">
      <div className=" screen:pb-16 tablet:pb-10">
        <Header header="Bli kjent med våre kurs" />
      </div>

      <div className="m-w-0 w-[98%]  flex items-center justify-center m-auto">
        <Swiper
          loop={true}
          grabCursor={true}
          loopFillGroupWithBlank={true}
          breakpoints={{
            "@0.00": {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            700: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
          }}
          className="mySwipe  rounded-xl !py-5 "
        >
          {CoursesDescriptionsMobile.map((item, id) => (
            <SwiperSlide key={item.id}>
              <div
                className={
                  " w-full h-full rounded-xl overflow-hidden " + item.border
                }
              >
                <div className="p-2 screen:h-[30vh] tablet:h-[28vh]">
                  <img src={item.image} alt="Fortnite" className="rounded-xl" />
                </div>
                <div className=" pt-3 pb-8 mobile:pb-4 screen:h-[51vh] tablet:h-full">
                  <span className="text-3xl font-bold small-mobile:text-2xl">
                    {item.title}
                  </span>
                  <p className="pt-3 text-left screen:px-4  tablet:px-2 text-xl tablet:text-[1.18rem] small-mobile:text-[0.95rem]">
                    {item.description}
                  </p>
                  <div className="pt-5">
                    <Link to={item.link}>
                      <button className="font-bold  py-2 px-5 bg-red-700 hover:opacity-80 rounded-xl tablet:text-sm">
                        Les mer
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AboutCoursesMobile;
