jest.mock('../src/services/mailService', () => ({
  sendWelcome: jest.fn().mockResolvedValue(true),
  sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
}));
const request = require('supertest');
const app = require('../src/app');
let token;

describe('Event Flow', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Organizer', email: 'org@example.com', password: 'password', role: 'organizer' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'org@example.com', password: 'password' });
    token = res.body.token;
  });

  it('should create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Event', description: 'Desc', startAt: new Date(), endAt: new Date() });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('event');
  });

  it('should list events', async () => {
    const res = await request(app)
      .get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });
});
