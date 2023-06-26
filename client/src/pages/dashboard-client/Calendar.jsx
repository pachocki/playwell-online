import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";

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
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/events")
      .then(response => setEvents(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleEventSelect = event => {
    console.log("Selected event:", event);
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (title) {
      const newEvent = { start, end, title };
      axios.post("/api/events", newEvent)
        .then(response => setEvents([...events, response.data]))
        .catch(error => console.log(error));
    }
  };

  const handleEventUpdate = updatedEvent => {
    axios.put(`/api/events/${updatedEvent.id}`, updatedEvent)
      .then(() => {
        const updatedEvents = events.map(event => {
          if (event.id === updatedEvent.id) {
            return updatedEvent;
          } else {
            return event;
          }
        });
        setEvents(updatedEvents);
      })
      .catch(error => console.log(error));
  };

  const handleEventDelete = eventId => {
    axios.delete(`/api/events/${eventId}`)
      .then(() => {
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h1>Events:</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} ({event.start} - {event.end}){" "}
            <button onClick={() => handleEventSelect(event)}>Select</button>{" "}
            <button onClick={() => handleEventDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelectSlot}
        resizable
        selectable
        eventPropGetter={event => {
          const backgroundColor = event.colorEvent ? event.colorEvent : "red";
          const color = event.color ? event.color : "white";
          return { style: { backgroundColor, color } };
        }}
      />
    </div>
  );
};

export default DashboardCalendar;