import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../../styles.css";

// import required modules
import { Autoplay, Navigation } from "swiper";
import Logo from "../../assets/playwell-header.webp";
import fortnite from "../../assets/fortnite/fortnite-paralax.webp";
import minecraft from "../../assets/minecraft-course.webp";
import roblox from "../../assets/roblox/roblox-hero.png";
import koding from "../../assets/koding/koding-hero.png";

const DashboardHero = () => {
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("https://pwo-mern-api.onrender.com/api/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error(error);
        setEvents([]);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events that start and end today and have the title "fortnite", "roblox", "minecraft", or "koding"
    const today = new Date().toISOString().substring(0, 10); // get today's date in YYYY-MM-DD format
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(Date.parse(event.start))
        .toISOString()
        .substring(0, 10);
      const eventEndDate = new Date(Date.parse(event.end))
        .toISOString()
        .substring(0, 10);
      const title = event?.title?.toLowerCase()?.split(" ")[0]; // add null check for title
      return (
        eventStartDate <= today &&
        eventEndDate >= today &&
        (title && (title.includes("fortnite") ||
          title.includes("roblox") ||
          title.includes("minecraft") ||
          title.includes("koding")))
      );
    });

    // Set the filtered events as the events to display
    setFilteredEvents(filteredEvents);
    // Set the first matching event as the banner event
    if (filteredEvents?.length > 0) {
      setEvent(filteredEvents[0]);
    } else {
      setEvent(null);
    }
  }, [events]);

  const getImagePath = (event) => {
    const title = event?.title?.toLowerCase()?.split(" ")[0];
    if (title === "fortnite") {
      return fortnite;
    } else if (title === "roblox") {
      return roblox;
    } else if (title === "minecraft") {
      return minecraft;
    } else if (title === "koding") {
      return koding;
    } else {
      return Image;
    }
  };
 
console.log(filteredEvents)
  return (
    <div>
    {filteredEvents && filteredEvents.length > 0 ? (
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 9500,
          disableOnInteraction: false,
        }}
       
        navigation={true}
        modules={[Autoplay,Navigation]}
        className="mySwiper"
      >
        {filteredEvents.map((event) => (
          <SwiperSlide>
            <div
              className="flex flex-col justify-center items-center w-full h-[55vh] bg-cover bg-no-repeat bg-center overlay-bg relative"
              style={{ backgroundImage: `url(${getImagePath(event)})` }}
            >
              <div className="absolute z-10 text-center">
                <h1 className="text-7xl tablet:text-6xl mobile:text-4xl small-mobile:text-3xl">
                  Dagens kurs
                </h1>
                <h2 className="text-7xl tablet:text-6xl mobile:text-4xl small-mobile:text-3xl">
                  {event.title.charAt(0).toUpperCase() + event?.title.slice(1)}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    ) : (
      <div className="flex flex-col justify-center items-center relative w-full h-[55vh] bg-no-repeat bg-cover bg-center bg-hero-dashboard mobile:h-[50vh]">
        <img src={Logo} className="px-5" alt="playwell-logo" />
        <h1 className="text-7xl tablet:text-6xl mobile:text-4xl small-mobile:text-3xl">
          Online
        </h1>
      </div>
    )}
  </div>
);
};

export default DashboardHero;
