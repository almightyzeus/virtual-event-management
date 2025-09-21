jest.mock('../src/services/mailService', () => ({
  sendWelcome: jest.fn().mockResolvedValue(true),
  sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
}));
const request = require('supertest');
const app = require('../src/app');
let organizerToken, attendeeToken, eventId;

describe('Event Negative & Edge Cases', () => {
  beforeAll(async () => {
    // Register organizer
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Org', email: 'orgneg@example.com', password: 'password', role: 'organizer' });
    const orgRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'orgneg@example.com', password: 'password' });
    organizerToken = orgRes.body.token;

    // Register attendee
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Att', email: 'attneg@example.com', password: 'password', role: 'attendee' });
    const attRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'attneg@example.com', password: 'password' });
    attendeeToken = attRes.body.token;

    // Organizer creates event
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Edge Event', description: 'Edge', startAt: new Date(), endAt: new Date() });
    eventId = eventRes.body.event._id;
  });

  it('should not allow attendee to create event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ title: 'Fail', description: 'Fail', startAt: new Date(), endAt: new Date() });
    expect(res.statusCode).toBe(403);
  });

  it('should not allow unauthenticated event creation', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Fail', description: 'Fail', startAt: new Date(), endAt: new Date() });
    expect(res.statusCode).toBe(401);
  });

  it('should not allow attendee to update event', async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ title: 'Updated', startAt: new Date() });
    expect(res.statusCode).toBe(403);
  });

  it('should not allow unauthenticated event update', async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .send({ title: 'Updated', startAt: new Date() });
    expect(res.statusCode).toBe(401);
  });

  it('should not allow attendee to delete event', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should not allow unauthenticated event delete', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(401);
  });

  it('should not allow duplicate event registration', async () => {
    // First registration
    await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    // Duplicate registration
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for non-existent event', async () => {
    const fakeId = '614c1b1a1a1a1a1a1a1a1a1a';
    const res = await request(app)
      .get(`/api/events/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid event creation data', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: '' });
    expect(res.statusCode).toBe(400);
  });
  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });
});
