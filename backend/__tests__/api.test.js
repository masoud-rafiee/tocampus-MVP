// ToCampus API Tests
// Uses supertest to test Express app directly (no running server needed)

const request = require('supertest');
const { app } = require('../server');

describe('ToCampus API', () => {
  let authToken;
  let staffToken;

  // ============================================
  // Health Check Tests
  // ============================================
  describe('Health Check', () => {
    test('GET /health should return ok status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });

    test('GET / should return API info', async () => {
      const res = await request(app).get('/');
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('ToCampus API');
      expect(res.body.version).toBe('1.0.0');
    });
  });

  // ============================================
  // Authentication Tests (FR1, FR2, FR3)
  // ============================================
  describe('Authentication', () => {
    test('POST /api/auth/login with valid credentials should return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('student@ubishops.ca');
      expect(res.body.user.role).toBe('STUDENT');
      
      // Save token for later tests
      authToken = res.body.token;
    });

    test('POST /api/auth/login with invalid credentials should return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
    });

    test('POST /api/auth/register with new user should create account', async () => {
      const uniqueEmail = `test${Date.now()}@ubishops.ca`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'TestPass123!',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect([200, 201]).toContain(res.status);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    test('POST /api/auth/forgot-password should return reset token', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'student@ubishops.ca'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });
  });

  // ============================================
  // Protected Routes (No Token) Tests
  // ============================================
  describe('Protected Routes (No Token)', () => {
    test('GET /api/events without token should return 401', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(401);
    });

    test('GET /api/groups without token should return 401', async () => {
      const res = await request(app).get('/api/groups');
      expect(res.status).toBe(401);
    });

    test('GET /api/announcements without token should return 401', async () => {
      const res = await request(app).get('/api/announcements');
      expect(res.status).toBe(401);
    });
  });

  // ============================================
  // Events Tests (FR4, FR5)
  // ============================================
  describe('Events', () => {
    beforeAll(async () => {
      // Get student token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'password123'
        });
      authToken = res.body.token;
    });

    test('GET /api/events should return events list', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/events as student should return 403', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Event',
          description: 'Test Description',
          date: new Date().toISOString(),
          location: 'Test Location',
          category: 'ACADEMIC'
        });
      
      expect(res.status).toBe(403);
    });
  });

  // ============================================
  // Groups Tests (FR7)
  // ============================================
  describe('Groups', () => {
    test('GET /api/groups should return groups list', async () => {
      const res = await request(app)
        .get('/api/groups')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Announcements Tests (FR6)
  // ============================================
  describe('Announcements', () => {
    test('GET /api/announcements should return announcements list', async () => {
      const res = await request(app)
        .get('/api/announcements')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Notifications Tests (FR12)
  // ============================================
  describe('Notifications', () => {
    test('GET /api/notifications should return notifications list', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Staff Permissions Tests (FR3)
  // ============================================
  describe('Staff Permissions', () => {
    beforeAll(async () => {
      // Get staff token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'staff@ubishops.ca',
          password: 'password123'
        });
      staffToken = res.body.token;
    });

    test('POST /api/events as staff should succeed', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          title: 'Staff Test Event',
          description: 'Created by staff in CI test',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test Hall',
          category: 'ACADEMIC'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Staff Test Event');
    });

    test('POST /api/announcements as staff should succeed', async () => {
      const res = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          title: 'Staff Test Announcement',
          content: 'Created by staff in CI test',
          scope: 'GLOBAL'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Staff Test Announcement');
    });
  });
});
