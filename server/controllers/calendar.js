// Import the Calendar model
const Calendar = require("../models/calendar");

// Add an event
exports.addEvent = async (req, res) => {
  const { title, start } = req.body;

  try {
    // Set the end date to be the same as the start date to create an all-day event
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const newEvent = new Calendar({
      title,
      allDay: true,
      start,
      end,
      colorEvent: "purple",
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Calendar.find();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const deletedEvent = await Calendar.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ message: "Event not found with ID: " + eventId });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Error deleting event with ID: " + eventId + " - " + error.message,
      });
  }
};
// Edit an event
exports.editEvent = async (req, res) => {
    const eventId = req.params.eventId;
  
    try {
      const updatedEvent = await Calendar.findByIdAndUpdate(
        eventId,
        req.body,
        { new: true }
      );
  
      if (!updatedEvent) {
        return res
          .status(404)
          .json({ message: "Event not found with ID: " + eventId });
      }
  
      res.json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            "Error updating event with ID: " + eventId + " - " + error.message,
        });
    }
  };