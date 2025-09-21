const Event = require('../models/eventModel');
const mailService = require('../services/mailService');


const listEvents = async (req, res) => {
  const events = await Event.find().populate('organizer', 'name email');
  res.json(events);
};

const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
};

const createEvent = async (req, res) => {
  const { title, description, startAt, endAt } = req.body;
  const ev = new Event({ title, description, startAt, endAt, organizer: req.user._id });
  await ev.save();
  res.status(201).json({ event: ev });
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (event.organizer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(event, req.body);
  await event.save();
  res.json({ event });
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (event.organizer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  await event.remove();
  res.json({ message: 'Deleted' });
};

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  const exists = event.participants.some(p => p.user.toString() === req.user._id.toString());
  if (exists) return res.status(400).json({ message: 'Already registered' });
  event.participants.push({ user: req.user._id });
  await event.save();
  // send confirmation
  mailService.sendRegistrationConfirmation(req.user, event).catch(err => console.error('Mail err', err));
  res.json({ message: 'Registered' });
};

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
};
