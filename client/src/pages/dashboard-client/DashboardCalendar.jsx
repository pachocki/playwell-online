import React, { useState, useCallback, useEffect, useContext } from "react";
//Big Calendar
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
//Date Library
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
//Events Data
import { events } from "../../data/Data";
import axios from "axios";
import { UserContext } from "../../context/context";

const locales = {
  "en-GB": require("date-fns/locale/en-GB"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DashboardCalendar = () => {
  const [state, setState] = useContext(UserContext);
  const [myEvents, setEvents] = useState([]);
  
  const isAdmin = state.user.email ==="pachocki175@gmail.com"
 

  const handleSelectSlot = useCallback(
   
    async ({ start }) => {
      if (!isAdmin) {
        alert("You don't have permission to create events.");
        return;
      }
      const title = window.prompt("New Event name");
      if (title) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/events",
            {
              title,
              start,
            }
          );
          if (response.status === 201) {
            const { message, event } = response.data;
            alert(message);
            setEvents([...myEvents, event]); 
            window.location.reload()
          }
        } catch (error) {
          console.error(error);
          alert("Something went wrong");
        }
      }
    },
    [myEvents]
  );

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data.events);
    } catch (error) {
      console.error(error);
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const handleSelectEvent = useCallback(
    async (event) => {
      if (!isAdmin) {
        alert("You don't have permission to edit or delete events.");
        return;
      }
      const action = window.prompt(
        `Do you want to delete or edit "${event.title}"?`
      );
      if (action === "delete") {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/events/${event._id}`
          );
          if (response.status === 200) {
            const updatedEvents = myEvents.filter((e) => e._id !== event._id);
            setEvents(updatedEvents);
            alert(response.data.message);
        
          }
        } catch (error) {
          console.error(error);
          alert("Something went wrong");
        }
      } else if (action === "edit") {
        const title = window.prompt("Enter new title", event.title);
        if (title) {
          try {
            const response = await axios.put(
              `http://localhost:5000/api/events/${event._id}`,
              {
                title,
                eventId: event._id,
              }
            );
            if (response.status === 200) {
              const updatedEvents = myEvents.map((e) => {
                if (e._id === event._id) {
                  return { ...e, title };
                } else {
                  return e;
                }
              });
              setEvents(updatedEvents);
              alert(response.data.message);
          
            }
          } catch (error) {
            console.error(error);
            alert("Something went wrong");
          }
        }
      }
    },
    [myEvents]
  );
  return (
    <div className="bg-zinc-900 backdrop-blur-xl  w-full  rounded-b-xl  overflow-hidden relative pb-20 tablet:mt-1 mobile:pb-0">
      <div className="w-[600px] h-[600px] rounded-full bg-red-500/20 blur-2xl  absolute top-10 right-0"></div>
      <div className="w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-2xl  absolute bottom-10 left-0"></div>
      <div className=" h-[100vh]  bg-zinc-900 w-[98%] m-auto overflow:hidden mobile:w-full pb-40">
        <h2 className="text-7xl text-center py-8 screen:text-5xl mobile:text-4xl ">
          Kurs Kalendar
        </h2>
        <Calendar
          localizer={localizer}
          events={myEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          resizable
          selectable
          eventPropGetter={(events) => {
            const backgroundColor = events.colorEvent
              ? events.colorEvent
              : "red";
            const color = events.color ? events.color : "white";
            return { style: { backgroundColor, color } };
          }}
        />
      </div>
    </div>
  );
};

export default DashboardCalendar;
