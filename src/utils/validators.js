const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('attendee', 'organizer').default('attendee'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  eventSchema
};
