
# Virtual Event Management Backend

A Node.js, Express, and MongoDB backend for managing virtual events, user registration, authentication, and participant management.

## Features
- User registration and login (JWT authentication)
- Event CRUD (create, read, update, delete)
- Participant registration for events
- Role-based access (organizer, attendee)
- Email notifications (mocked in tests)
- Input validation (Joi + Mongoose)
- Comprehensive unit tests (Jest + Supertest)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://localhost:27017/virtual-event-management
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Run tests
```bash
npm test -- --coverage
```

## API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `POST /api/events` — Create event (organizer only)
- `GET /api/events` — List events
- `GET /api/events/:id` — Get event details
- `PUT /api/events/:id` — Update event (organizer only)
- `DELETE /api/events/:id` — Delete event (organizer only)
- `POST /api/events/:id/register` — Register for event (attendee)

## Testing & Coverage
- Tests use Jest and Supertest
- Email sending is mocked in tests
- MongoDB connection is closed after tests
- Coverage reports are generated in `/coverage`


## Email Service: Mocking & Production Setup

### Development & Testing
- The email service is mocked in all tests using Jest, so no real emails are sent during testing.
- In development, the service uses [Ethereal Email](https://ethereal.email/) by default if you do not provide real SMTP credentials. Ethereal is a fake SMTP service for previewing emails.

### Production Usage
- For production, configure a real SMTP provider (e.g., Gmail, SendGrid, Mailgun) by setting `EMAIL_USER` and `EMAIL_PASS` in your `.env` file.
- Example `.env` for Gmail:
	```
	EMAIL_USER=your_gmail_address@gmail.com
	EMAIL_PASS=your_gmail_app_password
	```
- The code will automatically use these credentials for sending real emails in production.
- Make sure to use secure app passwords and never commit real credentials to version control.

### Switching Between Mock/Ethereal and Real SMTP
- No code changes are needed—just update your `.env` file with valid SMTP credentials for production.
- For advanced setups, you can extend the mail service to select providers based on `NODE_ENV` or other environment variables.

## Future Scope
- Add rate limiting and request logging for production
- Use a real SMTP provider for production emails
- Add more granular validation and error messages
- Implement pagination for event listing
- Add user profile endpoints if needed
- Improve test isolation (e.g., use in-memory MongoDB for tests)
- Add Swagger/OpenAPI documentation

## License
This project is licensed under the [MIT License](./.license).

