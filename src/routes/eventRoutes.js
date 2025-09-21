
const express = require('express');
const { listEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent } = require('../controllers/eventController');
const { auth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', auth, requireRole('organizer'), createEvent);
router.put('/:id', auth, requireRole('organizer'), updateEvent);
router.delete('/:id', auth, requireRole('organizer'), deleteEvent);
router.post('/:id/register', auth, registerForEvent);

module.exports = router;
