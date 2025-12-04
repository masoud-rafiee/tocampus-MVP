# ToCampus User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Feed & Announcements](#feed--announcements)
4. [Events](#events)
5. [Groups](#groups)
6. [Notifications](#notifications)
7. [Profile](#profile)
8. [Role-Based Features](#role-based-features)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid university email address (@ubishops.ca)

### Accessing ToCampus
1. Open your web browser
2. Navigate to the ToCampus URL (http://localhost:3000 for development)
3. You'll see the animated splash screen followed by the login page

---

## Authentication

### Creating an Account (Registration)
1. On the login screen, click **"Create Account"**
2. Fill in the registration form:
   - **Email**: Your university email (must end with @ubishops.ca)
   - **Password**: Minimum 6 characters
   - **First Name**: Your first name
   - **Last Name**: Your last name
3. Click **"Create Account"** button
4. You'll be automatically logged in and redirected to the Feed

### Logging In
1. Enter your registered email address
2. Enter your password
3. Click **"Sign In"**
4. You'll be redirected to the Feed page

### Forgot Password
1. On the login screen, click **"Forgot password?"**
2. Enter your registered email address
3. Click **"Send Reset Link"**
4. Check your email for the reset code
5. Enter the code and create a new password

### Logging Out
1. Navigate to the **Profile** tab (bottom navigation)
2. Click the **"Logout"** button
3. You'll be redirected to the login screen

---

## Feed & Announcements

The Feed is your main dashboard showing all campus announcements.

### Viewing Announcements
- Announcements appear as cards with:
  - Author name and avatar
  - Post title and content
  - Timestamp (e.g., "2h ago")
  - Like count and comment count

### Liking an Announcement
1. Click the **heart icon** (♡) on any announcement
2. The icon turns red and the like count increases
3. Click again to unlike

### Commenting on an Announcement
1. Click the **comment icon** (💬) on any announcement
2. Type your comment in the text field
3. Click **"Post"** to submit
4. Your comment appears in the comments section

### Sharing an Announcement
1. Click the **share icon** (↗) on any announcement
2. Select a platform (Instagram, Facebook, LinkedIn)
3. The announcement will be shared to that platform

---

## Events

### Viewing Events
1. Navigate to the **Events** tab (bottom navigation)
2. Browse upcoming campus events
3. Each event card shows:
   - Event title and description
   - Date and time
   - Location
   - Attendee count
   - Category badge (Academic, Social, Sports, etc.)

### RSVPing to an Event
1. Find an event you want to attend
2. Click the **"RSVP Now"** button
3. The button changes to **"Registered ✓"** (green)
4. The attendee count increases
5. You'll receive a confirmation notification

### Un-RSVPing from an Event
1. Click the **"Registered ✓"** button on an event you've RSVP'd to
2. Confirm the cancellation
3. You're removed from the attendee list

### Event Categories
- **Academic**: Lectures, workshops, study sessions
- **Social**: Parties, mixers, networking events
- **Sports**: Games, tournaments, fitness activities
- **Cultural**: Cultural celebrations, performances
- **Career**: Job fairs, resume workshops, interviews

---

## Groups

### Viewing Groups
1. Navigate to the **Groups** tab (bottom navigation)
2. Browse available campus groups and clubs
3. Each group card shows:
   - Group name and description
   - Member count
   - Category

### Joining a Group
1. Find a group you want to join
2. Click the **"Join"** button
3. The button changes to **"Joined ✓"**
4. You now have access to group-specific announcements

### Leaving a Group
1. Navigate to a group you're a member of
2. Click the **"Joined ✓"** button
3. Confirm leaving the group
4. You're removed from the member list

### Group Categories
- **Academic**: Study groups, research clubs
- **Sports**: Athletic teams, fitness clubs
- **Arts**: Music, theater, visual arts
- **Technology**: Coding clubs, tech organizations
- **Social**: Interest-based communities

---

## Notifications

### Viewing Notifications
1. Navigate to the **Notifications** tab (bottom navigation)
2. View all your notifications
3. Unread notifications have a **blue dot** indicator

### Notification Types
- **Event Reminder**: Upcoming event you've RSVP'd to
- **RSVP Confirmation**: Confirmation of your event registration
- **New Announcement**: New post in a group you follow
- **Event Approved**: Your event has been approved by admin

### Marking as Read
- Click on any notification to mark it as read
- The blue dot disappears

---

## Profile

### Viewing Your Profile
1. Navigate to the **Profile** tab (bottom navigation)
2. View your profile information:
   - Name and email
   - Role (Student, Staff, Faculty, Admin)
   - Member since date

### Profile Information Displayed
- **Avatar**: Your profile picture (initials by default)
- **Full Name**: Your first and last name
- **Email**: Your university email
- **Role**: Your access level
- **University**: Bishop's University

---

## Role-Based Features

### Student Role
- View feed and announcements
- Like and comment on posts
- RSVP to events
- Join groups
- Receive notifications

### Staff/Faculty Role
All Student features, plus:
- **Create Events**: Post new campus events
- **Create Announcements**: Post campus-wide or group announcements
- **Create Groups**: Start new campus groups

### Admin Role
All Staff features, plus:
- **Approve Events**: Review and approve pending events
- **Manage Users**: View and manage user accounts
- **Delete Content**: Remove inappropriate posts or events

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit forms |
| `Esc` | Close modals/dialogs |
| `Tab` | Navigate between fields |

---

## Troubleshooting

### Can't Log In
- Verify your email is correct
- Check your password (case-sensitive)
- Try the "Forgot Password" feature
- Ensure you have internet connection

### Events Not Loading
- Refresh the page
- Check your internet connection
- Try logging out and back in

### Notifications Not Appearing
- Ensure you're logged in
- Check your notification settings
- Refresh the page

### Page Not Responding
- Clear your browser cache
- Try a different browser
- Check if the server is running

---

## Contact Support

If you experience issues not covered in this guide:
- **Email**: support@tocampus.ca
- **Help Desk**: Student Services Building, Room 101
- **Hours**: Monday-Friday, 9 AM - 5 PM EST

---

## Quick Reference

### Test Accounts (Development)
| Role | Email | Password |
|------|-------|----------|
| Student | student@ubishops.ca | password123 |
| Staff | staff@ubishops.ca | password123 |
| Admin | admin@ubishops.ca | password123 |

### Navigation
- **Feed**: Home icon - View announcements
- **Events**: Calendar icon - Browse and RSVP to events
- **Groups**: Users icon - Join campus groups
- **Notifications**: Bell icon - View alerts
- **Profile**: User icon - Account settings

---

**ToCampus v1.0** | Bishop's University | © 2025