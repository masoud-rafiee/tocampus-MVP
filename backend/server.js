// server.js - Main backend entry point
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
}

// In-memory database (matches Python prototype structure)
const DB = {
  universities: new Map(),
  users: new Map(),
  events: new Map(),
  rsvps: new Map(),
  groups: new Map(),
  memberships: new Map(),
  announcements: new Map(),
  comments: new Map(),
  notifications: new Map(),
  messages: new Map(),
  socialShares: new Map(),
  sessions: new Map()
};

// Initialize sample data
const initializeData = () => {
  // Create university
  const universityId = uuidv4();
  DB.universities.set(universityId, {
    id: universityId,
    name: "Bishop's University",
    domain: 'ubishops.ca',
    locale: 'en_CA',
    timezone: 'America/Toronto',
    brandingConfig: {},
    socialMediaConfig: {},
    createdAt: new Date().toISOString()
  });

  // Create users
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  const adminId = uuidv4();
  DB.users.set(adminId, {
    id: adminId,
    universityId,
    email: 'admin@ubishops.ca',
    passwordHash,
    firstName: 'Alice',
    lastName: 'Admin',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  });

  const staffId = uuidv4();
  DB.users.set(staffId, {
    id: staffId,
    universityId,
    email: 'staff@ubishops.ca',
    passwordHash,
    firstName: 'Bob',
    lastName: 'Staff',
    role: 'STAFF',
    createdAt: new Date().toISOString()
  });

  const studentId = uuidv4();
  DB.users.set(studentId, {
    id: studentId,
    universityId,
    email: 'student@ubishops.ca',
    passwordHash,
    firstName: 'Charlie',
    lastName: 'Student',
    role: 'STUDENT',
    createdAt: new Date().toISOString()
  });

  // Create events (3 events)
  const event1Id = uuidv4();
  DB.events.set(event1Id, {
    id: event1Id,
    universityId,
    creatorId: staffId,
    title: 'Welcome Fair 2025',
    description: 'Discover clubs and resources at the annual welcome fair. Meet new friends, explore opportunities, and get involved in campus life! Free food and giveaways.',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: 'Campus Quad',
    category: 'Social',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 124
  });

  const event2Id = uuidv4();
  DB.events.set(event2Id, {
    id: event2Id,
    universityId,
    creatorId: staffId,
    title: 'Career Workshop: Resume Building',
    description: 'Learn how to craft the perfect resume with industry professionals. Bring your laptop and current resume for hands-on feedback.',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Career Center, Room 201',
    category: 'Academic',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 45
  });

  const event3Id = uuidv4();
  DB.events.set(event3Id, {
    id: event3Id,
    universityId,
    creatorId: staffId,
    title: 'Basketball Tournament Finals',
    description: 'Cheer on your favorite intramural teams as they compete for the championship title! Refreshments provided.',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Sports Complex Gymnasium',
    category: 'Sports',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 89
  });

  // Create groups (3 groups)
  const group1Id = uuidv4();
  DB.groups.set(group1Id, {
    id: group1Id,
    universityId,
    name: 'Chess Club',
    description: 'Weekly meetings for chess enthusiasts of all skill levels. Tournaments, casual games, and lessons available.',
    category: 'Recreation',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 47
  });

  const group2Id = uuidv4();
  DB.groups.set(group2Id, {
    id: group2Id,
    universityId,
    name: 'Photography Society',
    description: 'Capture campus life! Photo walks, editing workshops, and exhibitions. Camera not required - phone photography welcome!',
    category: 'Arts',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 82
  });

  const group3Id = uuidv4();
  DB.groups.set(group3Id, {
    id: group3Id,
    universityId,
    name: 'Computer Science Club',
    description: 'Hackathons, coding challenges, tech talks, and networking with industry professionals. All majors welcome!',
    category: 'Academic',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 156
  });

  // Create announcements (3 announcements)
  const ann1Id = uuidv4();
  DB.announcements.set(ann1Id, {
    id: ann1Id,
    universityId,
    authorId: staffId,
    title: '📚 Library Extended Hours for Finals',
    content: 'Great news! The John Chicken Library will be open 24/7 during finals week (Dec 9-20). Quiet study zones, group study rooms, and free coffee available after 10 PM. Good luck on your exams!',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  const ann2Id = uuidv4();
  DB.announcements.set(ann2Id, {
    id: ann2Id,
    universityId,
    authorId: staffId,
    title: '🎉 Winter Break Shuttle Service',
    content: 'Free shuttle service to Montreal and Sherbrooke airports will run Dec 15-22. Book your seat through the Student Portal by Dec 10. Limited spots available!',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  const ann3Id = uuidv4();
  DB.announcements.set(ann3Id, {
    id: ann3Id,
    universityId,
    authorId: adminId,
    title: '🍕 Free Pizza Friday This Week!',
    content: 'Join us this Friday at the Student Union Building for Free Pizza Friday! All students welcome. Starts at 12 PM while supplies last. Vegetarian and gluten-free options available.',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  // Create notifications for student (3 notifications)
  const notif1Id = uuidv4();
  DB.notifications.set(notif1Id, {
    id: notif1Id,
    userId: studentId,
    type: 'EVENT_REMINDER',
    title: '⏰ Event Reminder',
    message: 'Career Workshop: Resume Building starts in 3 days. Don\'t forget to bring your laptop!',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  });

  const notif2Id = uuidv4();
  DB.notifications.set(notif2Id, {
    id: notif2Id,
    userId: studentId,
    type: 'NEW_ANNOUNCEMENT',
    title: '📢 New Announcement',
    message: 'Library Services posted: Library Extended Hours for Finals',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  });

  const notif3Id = uuidv4();
  DB.notifications.set(notif3Id, {
    id: notif3Id,
    userId: studentId,
    type: 'GROUP_UPDATE',
    title: '👥 Group Activity',
    message: 'Computer Science Club: New hackathon registration is now open!',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = DB.users.get(user.userId);
    next();
  });
};

// Helper: Validate university email domain
const validateUniversityEmail = (email) => {
  // Get all valid university domains
  const validDomains = Array.from(DB.universities.values()).map(u => u.domain);
  const emailDomain = email.split('@')[1];
  return validDomains.includes(emailDomain);
};

// Routes

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, universityId, role = 'STUDENT' } = req.body;
    
    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate university email domain (SRS FR1)
    if (!validateUniversityEmail(email)) {
      return res.status(400).json({ error: 'Please use a valid university email address' });
    }

    // Validate password strength (SRS FR1)
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    for (const user of DB.users.values()) {
      if (user.email === email) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // Find university by email domain
    const emailDomain = email.split('@')[1];
    let userUniversityId = universityId;
    if (!userUniversityId) {
      for (const [id, uni] of DB.universities.entries()) {
        if (uni.domain === emailDomain) {
          userUniversityId = id;
          break;
        }
      }
    }

    const newUser = {
      id: userId,
      universityId: userUniversityId || Array.from(DB.universities.keys())[0],
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString()
    };

    DB.users.set(userId, newUser);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset Request (SRS FR2)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token (6 digit code for simplicity in MVP)
    const resetToken = Math.random().toString().slice(2, 8);
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Store reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetExpiry.toISOString();

    // In production, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset (SRS FR2)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    // Find user by email
    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user || !user.resetToken) {
      return res.status(400).json({ error: 'Invalid reset request' });
    }

    // Check token validity
    if (user.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check token expiry
    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Update password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events
app.get('/api/events', authenticateToken, (req, res) => {
  const events = Array.from(DB.events.values())
    .filter(e => e.universityId === req.user.universityId && e.status === 'PUBLISHED')
    .map(event => ({
      ...event,
      attendeeCount: event.rsvpIds.length || event.defaultAttendeeCount || 0,
      creator: (() => {
        const creator = DB.users.get(event.creatorId);
        return creator ? { firstName: creator.firstName, lastName: creator.lastName } : null;
      })()
    }));
  res.json(events);
});

app.post('/api/events', authenticateToken, (req, res) => {
  if (!['STAFF', 'FACULTY', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only staff and faculty can create events' });
  }

  const eventId = uuidv4();
  const newEvent = {
    id: eventId,
    universityId: req.user.universityId,
    creatorId: req.user.id,
    ...req.body,
    status: 'DRAFT',
    isApproved: false,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: []
  };

  DB.events.set(eventId, newEvent);

  // Create notification for admins about new event pending approval
  for (const user of DB.users.values()) {
    if (user.role === 'ADMIN' && user.universityId === req.user.universityId) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'EVENT_PENDING',
        title: '📋 Event Pending Approval',
        message: `New event "${newEvent.title}" awaits your approval`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.status(201).json(newEvent);
});

// Event Approval (SRS FR4 - Admin workflow)
app.post('/api/events/:id/approve', authenticateToken, (req, res) => {
  // Only admins can approve events
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can approve events' });
  }

  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  event.isApproved = true;

  // Notify the event creator
  const notifId = uuidv4();
  DB.notifications.set(notifId, {
    id: notifId,
    userId: event.creatorId,
    type: 'EVENT_APPROVED',
    title: '✅ Event Approved',
    message: `Your event "${event.title}" has been approved by admin`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json(event);
});

// Event Publication (SRS FR4)
app.post('/api/events/:id/publish', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Only creator or admin can publish
  if (event.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only event creator or admin can publish' });
  }

  // Must be approved before publishing
  if (!event.isApproved) {
    return res.status(400).json({ error: 'Event must be approved before publishing' });
  }

  event.status = 'PUBLISHED';

  // Create notifications for all users in the university (SRS FR12)
  for (const user of DB.users.values()) {
    if (user.universityId === event.universityId && user.id !== event.creatorId) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'NEW_EVENT',
        title: '🎉 New Event',
        message: `New event: "${event.title}" on ${new Date(event.startTime).toLocaleDateString()}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Trigger social media sharing (SRS FR6a, FR6b)
  if (req.body.shareTo && req.body.shareTo.length > 0) {
    req.body.shareTo.forEach(platform => {
      const shareId = uuidv4();
      DB.socialShares.set(shareId, {
        id: shareId,
        eventId: event.id,
        platform: platform.toUpperCase(),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
      event.socialShareIds.push(shareId);
    });
  }

  res.json(event);
});

// Cancel RSVP
app.delete('/api/events/:id/rsvp', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Find and remove user's RSVP
  const rsvpIndex = event.rsvpIds.findIndex(rsvpId => {
    const rsvp = DB.rsvps.get(rsvpId);
    return rsvp && rsvp.userId === req.user.id;
  });

  if (rsvpIndex === -1) {
    return res.status(404).json({ error: 'RSVP not found' });
  }

  const rsvpId = event.rsvpIds[rsvpIndex];
  DB.rsvps.delete(rsvpId);
  event.rsvpIds.splice(rsvpIndex, 1);

  res.json({ message: 'RSVP cancelled' });
});

app.post('/api/events/:id/rsvp', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Check if already RSVPed
  for (const rsvpId of event.rsvpIds) {
    const rsvp = DB.rsvps.get(rsvpId);
    if (rsvp && rsvp.userId === req.user.id) {
      return res.json(rsvp); // Return existing RSVP
    }
  }

  const rsvpId = uuidv4();
  const newRSVP = {
    id: rsvpId,
    userId: req.user.id,
    eventId: event.id,
    status: req.body.status || 'GOING',
    createdAt: new Date().toISOString()
  };

  DB.rsvps.set(rsvpId, newRSVP);
  event.rsvpIds.push(rsvpId);

  // Send confirmation notification (SRS FR5)
  const notifId = uuidv4();
  DB.notifications.set(notifId, {
    id: notifId,
    userId: req.user.id,
    type: 'RSVP_CONFIRMATION',
    title: '✅ RSVP Confirmed',
    message: `You're registered for "${event.title}"`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json(newRSVP);
});

// Groups
app.get('/api/groups', authenticateToken, (req, res) => {
  const groups = Array.from(DB.groups.values())
    .filter(g => g.universityId === req.user.universityId)
    .map(group => ({
      ...group,
      // Use actual member count or default display count
      memberCount: group.membershipIds.length || group.defaultMemberCount || 0
    }));
  res.json(groups);
});

app.post('/api/groups', authenticateToken, (req, res) => {
  if (!['STAFF', 'FACULTY', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only staff and faculty can create groups' });
  }

  const groupId = uuidv4();
  const newGroup = {
    id: groupId,
    universityId: req.user.universityId,
    ...req.body,
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: []
  };

  DB.groups.set(groupId, newGroup);

  // Add creator as admin
  const membershipId = uuidv4();
  const membership = {
    id: membershipId,
    userId: req.user.id,
    groupId,
    role: 'ADMIN',
    joinedAt: new Date().toISOString()
  };
  DB.memberships.set(membershipId, membership);
  newGroup.membershipIds.push(membershipId);

  res.status(201).json(newGroup);
});

app.post('/api/groups/:id/join', authenticateToken, (req, res) => {
  const group = DB.groups.get(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Check if already member
  for (const membershipId of group.membershipIds) {
    const membership = DB.memberships.get(membershipId);
    if (membership.userId === req.user.id) {
      return res.json(membership);
    }
  }

  const membershipId = uuidv4();
  const membership = {
    id: membershipId,
    userId: req.user.id,
    groupId: group.id,
    role: 'MEMBER',
    joinedAt: new Date().toISOString()
  };

  DB.memberships.set(membershipId, membership);
  group.membershipIds.push(membershipId);

  // Send notification about new member (SRS FR9)
  // Notify group admins
  for (const memId of group.membershipIds) {
    const mem = DB.memberships.get(memId);
    if (mem && mem.role === 'ADMIN' && mem.userId !== req.user.id) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: mem.userId,
        type: 'GROUP_MEMBER_JOINED',
        title: '👥 New Member',
        message: `${req.user.firstName} ${req.user.lastName} joined ${group.name}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.json(membership);
});

// Leave Group (SRS FR7)
app.delete('/api/groups/:id/leave', authenticateToken, (req, res) => {
  const group = DB.groups.get(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Find membership
  let membershipToRemove = null;
  let membershipIndex = -1;
  
  for (let i = 0; i < group.membershipIds.length; i++) {
    const membership = DB.memberships.get(group.membershipIds[i]);
    if (membership && membership.userId === req.user.id) {
      membershipToRemove = membership;
      membershipIndex = i;
      break;
    }
  }

  if (!membershipToRemove) {
    return res.status(404).json({ error: 'Not a member of this group' });
  }

  // Cannot leave if you're the only admin
  if (membershipToRemove.role === 'ADMIN') {
    const adminCount = group.membershipIds.filter(id => {
      const m = DB.memberships.get(id);
      return m && m.role === 'ADMIN';
    }).length;
    
    if (adminCount === 1) {
      return res.status(400).json({ error: 'Cannot leave as the only admin. Transfer ownership first.' });
    }
  }

  // Remove membership
  DB.memberships.delete(membershipToRemove.id);
  group.membershipIds.splice(membershipIndex, 1);

  res.json({ message: 'Left group successfully' });
});

// Announcements
app.get('/api/announcements', authenticateToken, (req, res) => {
  const announcements = Array.from(DB.announcements.values())
    .filter(a => a.universityId === req.user.universityId)
    .map(announcement => ({
      ...announcement,
      likeCount: announcement.likeUserIds.length,
      commentCount: announcement.commentIds.length,
      author: (() => {
        const author = DB.users.get(announcement.authorId);
        return author ? { firstName: author.firstName, lastName: author.lastName } : null;
      })()
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(announcements);
});

app.post('/api/announcements', authenticateToken, (req, res) => {
  if (!['STAFF', 'FACULTY', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only staff and faculty can post announcements' });
  }

  const announcementId = uuidv4();
  const newAnnouncement = {
    id: announcementId,
    universityId: req.user.universityId,
    authorId: req.user.id,
    ...req.body,
    scope: req.body.scope || 'GLOBAL',
    createdAt: new Date().toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  };

  DB.announcements.set(announcementId, newAnnouncement);

  // Create notifications for users (FR12 - Notification System)
  const author = DB.users.get(req.user.id);
  const authorName = author ? `${author.firstName} ${author.lastName}` : 'Staff';
  
  // If group-scoped, notify group members
  if (req.body.groupId) {
    const memberships = Array.from(DB.memberships.values())
      .filter(m => m.groupId === req.body.groupId);
    
    memberships.forEach(membership => {
      if (membership.userId !== req.user.id) {
        const notifId = uuidv4();
        DB.notifications.set(notifId, {
          id: notifId,
          userId: membership.userId,
          type: 'GROUP_ANNOUNCEMENT',
          title: 'New Group Announcement',
          message: `${authorName} posted: ${newAnnouncement.title || 'New announcement'}`,
          relatedId: announcementId,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });
  } else {
    // Global announcement - notify all users at same university
    const users = Array.from(DB.users.values())
      .filter(u => u.universityId === req.user.universityId && u.id !== req.user.id);
    
    users.forEach(user => {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'ANNOUNCEMENT',
        title: 'New Announcement',
        message: `${authorName} posted: ${newAnnouncement.title || 'New announcement'}`,
        relatedId: announcementId,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
  }

  res.status(201).json(newAnnouncement);
});

app.post('/api/announcements/:id/like', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const index = announcement.likeUserIds.indexOf(req.user.id);
  if (index > -1) {
    announcement.likeUserIds.splice(index, 1);
  } else {
    announcement.likeUserIds.push(req.user.id);
  }

  res.json({ likeCount: announcement.likeUserIds.length });
});

app.post('/api/announcements/:id/comments', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const commentId = uuidv4();
  const newComment = {
    id: commentId,
    announcementId: announcement.id,
    authorId: req.user.id,
    content: req.body.content,
    createdAt: new Date().toISOString()
  };

  DB.comments.set(commentId, newComment);
  announcement.commentIds.push(commentId);

  res.status(201).json(newComment);
});

// Social Sharing (FR6a, FR6b - Social Media Selection & Cross-Posting)
app.post('/api/events/:id/share', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { platforms } = req.body; // ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN']
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Please select at least one social platform' });
  }

  const validPlatforms = ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'];
  const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
  if (invalidPlatforms.length > 0) {
    return res.status(400).json({ error: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
  }

  const shareId = uuidv4();
  const socialShare = {
    id: shareId,
    contentType: 'EVENT',
    contentId: event.id,
    userId: req.user.id,
    platforms: platforms,
    sharedAt: new Date().toISOString(),
    status: 'SHARED' // In production, this would track actual posting status
  };

  DB.socialShares.set(shareId, socialShare);
  if (!event.socialShareIds) event.socialShareIds = [];
  event.socialShareIds.push(shareId);

  res.status(201).json({
    message: `Event shared to ${platforms.join(', ')}`,
    share: socialShare
  });
});

app.post('/api/announcements/:id/share', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const { platforms } = req.body;
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Please select at least one social platform' });
  }

  const validPlatforms = ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'];
  const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
  if (invalidPlatforms.length > 0) {
    return res.status(400).json({ error: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
  }

  const shareId = uuidv4();
  const socialShare = {
    id: shareId,
    contentType: 'ANNOUNCEMENT',
    contentId: announcement.id,
    userId: req.user.id,
    platforms: platforms,
    sharedAt: new Date().toISOString(),
    status: 'SHARED'
  };

  DB.socialShares.set(shareId, socialShare);
  if (!announcement.socialShareIds) announcement.socialShareIds = [];
  announcement.socialShareIds.push(shareId);

  res.status(201).json({
    message: `Announcement shared to ${platforms.join(', ')}`,
    share: socialShare
  });
});

app.get('/api/social/shares', authenticateToken, (req, res) => {
  const shares = Array.from(DB.socialShares.values())
    .filter(s => s.userId === req.user.id)
    .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));
  res.json(shares);
});

// Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  const notifications = Array.from(DB.notifications.values())
    .filter(n => n.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(notifications);
});

app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const notification = DB.notifications.get(req.params.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.isRead = true;
  res.json(notification);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for any non-API route in production (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`ToCampus API server running on port ${PORT}`);
  console.log(`Universities: ${DB.universities.size}`);
  console.log(`Users: ${DB.users.size}`);
  console.log(`Events: ${DB.events.size}`);
  console.log(`Groups: ${DB.groups.size}`);
});
