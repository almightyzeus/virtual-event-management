jest.mock('../src/services/mailService', () => ({
  sendWelcome: jest.fn().mockResolvedValue(true),
  sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
}));
const request = require('supertest');
const app = require('../src/app');
let token, eventId;

describe('Event Registration Flow', () => {
  let organizerToken;
  beforeAll(async () => {
    // Register attendee
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Attendee', email: 'attendee@example.com', password: 'password', role: 'attendee' });
    const attendeeRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'attendee@example.com', password: 'password' });
    token = attendeeRes.body.token;

    // Register organizer
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Organizer', email: 'organizer@example.com', password: 'password', role: 'organizer' });
    const organizerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'organizer@example.com', password: 'password' });
    organizerToken = organizerRes.body.token;

    // Organizer creates event
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Event2', description: 'Desc2', startAt: new Date(), endAt: new Date() });
    eventId = eventRes.body.event._id;
  });

  it('should register for an event', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not allow attendee to create event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Attendee Event', description: 'Should fail', startAt: new Date(), endAt: new Date() });
    expect(res.statusCode).toBe(403);
  });
  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });
});
