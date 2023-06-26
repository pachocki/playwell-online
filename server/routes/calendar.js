const express = require('express');
const router = express.Router();
const { addEvent, getAllEvents, deleteEvent,editEvent } = require('../controllers/calendar');

// Add an event
router.post('/events', addEvent);

// Get all events
router.get('/events', getAllEvents);

// Remove an event
router.delete('/events/:eventId', deleteEvent);
// Edit an event
router.put('/events/:eventId', editEvent);
module.exports = router;