// ToCampus API Tests
// Tests run against running server at localhost:3001

// We need to export the app from server.js for testing
// For now, we'll test against the running server

const API_URL = 'http://localhost:3001';

describe('ToCampus API', () => {
  let authToken;
  let testUserId;

  // ============================================
  // Health Check Tests
  // ============================================
  describe('Health Check', () => {
    test('GET /health should return ok status', async () => {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.timestamp).toBeDefined();
    });

    test('GET / should return API info', async () => {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.name).toBe('ToCampus API');
      expect(data.version).toBe('1.0.0');
    });
  });

  // ============================================
  // Authentication Tests (FR1, FR2, FR3)
  // ============================================
  describe('Authentication', () => {
    test('POST /api/auth/login with valid credentials should return token', async () => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@ubishops.ca',
          password: 'password123'
        })
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('student@ubishops.ca');
      expect(data.user.role).toBe('STUDENT');
      
      // Save token for later tests
      authToken = data.token;
      testUserId = data.user.id;
    });

    test('POST /api/auth/login with invalid credentials should return 401', async () => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@ubishops.ca',
          password: 'wrongpassword'
        })
      });
      
      expect(res.status).toBe(401);
    });

    test('POST /api/auth/register with new user should create account', async () => {
      const uniqueEmail = `test${Date.now()}@ubishops.ca`;
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: uniqueEmail,
          password: 'testpass123',
          firstName: 'Test',
          lastName: 'User',
          role: 'STUDENT'
        })
      });
      const data = await res.json();
      
      expect([200, 201]).toContain(res.status);
      expect(data.token).toBeDefined();
      expect(data.user.email).toBe(uniqueEmail);
    });

    test('POST /api/auth/forgot-password should return reset token', async () => {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@ubishops.ca'
        })
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.message).toContain('reset');
    });
  });

  // ============================================
  // Protected Routes - No Token Tests
  // ============================================
  describe('Protected Routes (No Token)', () => {
    test('GET /api/events without token should return 401', async () => {
      const res = await fetch(`${API_URL}/api/events`);
      expect(res.status).toBe(401);
    });

    test('GET /api/groups without token should return 401', async () => {
      const res = await fetch(`${API_URL}/api/groups`);
      expect(res.status).toBe(401);
    });

    test('GET /api/announcements without token should return 401', async () => {
      const res = await fetch(`${API_URL}/api/announcements`);
      expect(res.status).toBe(401);
    });
  });

  // ============================================
  // Events Tests (FR4, FR5)
  // ============================================
  describe('Events', () => {
    beforeAll(async () => {
      // Get token if not already set
      if (!authToken) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'student@ubishops.ca',
            password: 'password123'
          })
        });
        const data = await res.json();
        authToken = data.token;
      }
    });

    test('GET /api/events should return events list', async () => {
      const res = await fetch(`${API_URL}/api/events`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    test('POST /api/events as student should return 403', async () => {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Event',
          description: 'Test Description',
          startTime: new Date().toISOString(),
          location: 'Test Location'
        })
      });
      
      expect(res.status).toBe(403);
    });
  });

  // ============================================
  // Groups Tests (FR7)
  // ============================================
  describe('Groups', () => {
    test('GET /api/groups should return groups list', async () => {
      const res = await fetch(`${API_URL}/api/groups`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  // ============================================
  // Announcements Tests (FR6)
  // ============================================
  describe('Announcements', () => {
    test('GET /api/announcements should return announcements list', async () => {
      const res = await fetch(`${API_URL}/api/announcements`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  // ============================================
  // Notifications Tests (FR12)
  // ============================================
  describe('Notifications', () => {
    test('GET /api/notifications should return notifications list', async () => {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  // ============================================
  // Staff Role Tests (FR3)
  // ============================================
  describe('Staff Permissions', () => {
    let staffToken;

    beforeAll(async () => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'staff@ubishops.ca',
          password: 'password123'
        })
      });
      const data = await res.json();
      staffToken = data.token;
    });

    test('POST /api/events as staff should succeed', async () => {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${staffToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Staff Test Event',
          description: 'Created by staff',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 90000000).toISOString(),
          location: 'Test Location',
          category: 'Academic'
        })
      });
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data.title).toBe('Staff Test Event');
    });

    test('POST /api/announcements as staff should succeed', async () => {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${staffToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Staff Test Announcement',
          content: 'This is a test announcement',
          scope: 'GLOBAL'
        })
      });
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data.title).toBe('Staff Test Announcement');
    });
  });
});
