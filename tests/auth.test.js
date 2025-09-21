jest.mock('../src/services/mailService', () => ({
  sendWelcome: jest.fn().mockResolvedValue(true),
  sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
}));
const request = require('supertest');
const app = require('../src/app');

describe('Auth Flow', () => {
  it('should register a user', async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: uniqueEmail, password: 'password', role: 'attendee' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test2', email: 'test2@example.com', password: 'password', role: 'attendee' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test2@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });
});
