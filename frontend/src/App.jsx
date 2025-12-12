/**
 * ToCampus Frontend Application v3.0
 * 
 * Production-ready React 18 application implementing SRS v3.0
 * University social platform with events, groups, marketplace, and more
 * 
 * @version 3.0.0
 * @author Masoud Rafiee
 * @license MIT
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, Users, MessageSquare, Bell, Menu, X, Plus, ThumbsUp, MessageCircle, 
  Share2, CheckCircle, Clock, MapPin, User, Settings, LogOut, Home, Search, 
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Building, 
  UserCheck, AlertCircle, RefreshCw, ChevronLeft, Grid,
  Download, ExternalLink, Heart, Send, Copy, Instagram, Facebook, Twitter, 
  Linkedin, Tag, Shield, UserPlus, XCircle,
  Zap, Target, Coffee, Music, Palette,
  Camera, Code, Dumbbell, BookOpen, Mic, Gamepad2, Film, Plane,
  ShoppingBag, DollarSign, Package, Bot, Compass, MoreHorizontal,
  BellOff, CheckCheck, Volume2, Inbox, Megaphone, Activity, LayoutGrid
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Category configurations for filtering
const EVENT_CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid, color: 'gray' },
  { id: 'Social', label: 'Social', icon: Coffee, color: 'purple' },
  { id: 'Academic', label: 'Academic', icon: BookOpen, color: 'blue' },
  { id: 'Sports', label: 'Sports', icon: Dumbbell, color: 'green' },
  { id: 'Arts', label: 'Arts', icon: Palette, color: 'pink' },
  { id: 'Music', label: 'Music', icon: Music, color: 'yellow' },
  { id: 'Tech', label: 'Tech', icon: Code, color: 'cyan' },
  { id: 'Career', label: 'Career', icon: Target, color: 'orange' }
];

// Interest tags for profile
const INTEREST_TAGS = [
  { id: 'music', label: 'Music', icon: Music },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'arts', label: 'Arts & Design', icon: Palette },
  { id: 'tech', label: 'Technology', icon: Code },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'film', label: 'Film & Media', icon: Film },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'podcasts', label: 'Podcasts', icon: Mic },
  { id: 'coffee', label: 'Coffee & Social', icon: Coffee },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell }
];

// Marketplace categories (FR37-40)
const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Grid },
  { id: 'textbooks', label: 'Textbooks', icon: BookOpen },
  { id: 'electronics', label: 'Electronics', icon: Zap },
  { id: 'furniture', label: 'Furniture', icon: Package },
  { id: 'clothing', label: 'Clothing', icon: ShoppingBag },
  { id: 'other', label: 'Other', icon: Tag }
];

// Condition labels for marketplace
const CONDITION_LABELS = {
  'like_new': 'Like New',
  'excellent': 'Excellent',
  'good': 'Good',
  'fair': 'Fair',
  'poor': 'Poor'
};

// Social platforms for sharing
const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', bgColor: 'bg-blue-600' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#000000', bgColor: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-700' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366', bgColor: 'bg-green-500' },
  { id: 'copy', name: 'Copy Link', icon: Copy, color: '#6B7280', bgColor: 'bg-gray-600' }
];

// ============================================
// AUTHENTICATION SCREENS (SRS FR1, FR2, FR3)
// ============================================

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Gradient Orbs */}
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
    
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white rounded-full opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

// ============================================
// MODAL COMPONENTS (Enhanced UX)
// ============================================

// Generic Modal Wrapper
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`bg-gray-800 rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Event Details Modal (SRS FR4, FR5 Enhanced)
const EventDetailModal = ({ event, isOpen, onClose, onRSVP, hasRSVPed, onShare }) => {
  if (!isOpen || !event) return null;
  
  const formatFullDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const endTime = new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  };
  
  const handleAddToCalendar = () => {
    // Generate iCal format
    const startDate = new Date(event.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.endTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 rounded-full transition"
          >
            <X size={20} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
              {event.category || 'Event'}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <h2 className="text-white font-bold text-xl mb-2">{event.title}</h2>
          
          {/* Meta Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-400">
              <Calendar size={18} className="mr-3 text-purple-400" />
              <span>{formatFullDate(event.startTime)}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock size={18} className="mr-3 text-blue-400" />
              <span>{formatTimeRange(event.startTime, event.endTime)}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <MapPin size={18} className="mr-3 text-orange-400" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Users size={18} className="mr-3 text-green-400" />
              <span>{event.attendeeCount || 0} attending</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-5">
            <h3 className="text-white font-semibold mb-2">About this event</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-gray-700/50 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">📍 {event.location}</span>
              <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center">
                <ExternalLink size={14} className="mr-1" />
                Open in Maps
              </button>
            </div>
            <div className="h-24 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Map Preview (Integration Ready)
            </div>
          </div>
          
          {/* Organizer */}
          {event.creator && (
            <div className="flex items-center mb-5 p-3 bg-gray-700/30 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {event.creator.firstName?.[0]}{event.creator.lastName?.[0]}
              </div>
              <div>
                <p className="text-white text-sm font-medium">Organized by</p>
                <p className="text-gray-400 text-sm">{event.creator.firstName} {event.creator.lastName}</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onRSVP(event.id)}
              className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center ${
                hasRSVPed 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
              }`}
            >
              {hasRSVPed ? (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  You're Going!
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  RSVP Now
                </>
              )}
            </button>
            <button
              onClick={handleAddToCalendar}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
              title="Add to Calendar"
            >
              <Download size={20} className="text-gray-300" />
            </button>
            <button
              onClick={() => onShare(event)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
              title="Share Event"
            >
              <Share2 size={20} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Share Modal (SRS FR6a, FR6b)
const ShareModal = ({ isOpen, onClose, item, type = 'event' }) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  
  if (!isOpen || !item) return null;
  
  const shareUrl = `https://tocampus.app/${type}s/${item.id}`;
  const shareText = type === 'event' 
    ? `Check out this event: ${item.title}` 
    : `${item.title} - ToCampus`;
  
  const handleShare = async (platform) => {
    if (platform.id === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    const urls = {
      instagram: `https://instagram.com`, // Instagram doesn't support direct share URLs
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    };
    
    if (urls[platform.id]) {
      window.open(urls[platform.id], '_blank', 'width=600,height=400');
    }
    
    setSelectedPlatforms(prev => [...prev, platform.id]);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share" size="sm">
      <div className="p-4">
        <p className="text-gray-400 text-sm mb-4">Share "{item.title}" to your favorite platforms</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {SOCIAL_PLATFORMS.map(platform => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform)}
              className={`flex flex-col items-center p-4 rounded-xl transition ${
                selectedPlatforms.includes(platform.id) 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className={`w-12 h-12 ${platform.bgColor} rounded-full flex items-center justify-center mb-2`}>
                <platform.icon size={24} className="text-white" />
              </div>
              <span className="text-white text-xs">
                {platform.id === 'copy' && copied ? 'Copied!' : platform.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* Share URL */}
        <div className="bg-gray-700 rounded-xl p-3 flex items-center">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="flex-1 bg-transparent text-gray-300 text-sm outline-none"
          />
          <button 
            onClick={() => handleShare({ id: 'copy' })}
            className="text-purple-400 hover:text-purple-300 ml-2"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Create Event/Announcement Modal (SRS FR4, FR6)
const CreateEventModal = ({ isOpen, onClose, onSubmit, authToken }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Social',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          category: formData.category,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString()
        })
      });
      
      if (response.ok) {
        const newEvent = await response.json();
        onSubmit(newEvent);
        onClose();
        setFormData({
          title: '', description: '', location: '', category: 'Social',
          startDate: '', startTime: '', endDate: '', endTime: ''
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Event" size="lg">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Event Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="e.g., Career Fair 2025"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            rows={3}
            placeholder="Describe your event..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={e => setFormData({...formData, startTime: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">End Date *</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={e => setFormData({...formData, endTime: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="e.g., Student Union Building, Room 101"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            {EVENT_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
        
        <p className="text-gray-500 text-xs text-center">
          Events require admin approval before being published.
        </p>
      </form>
    </Modal>
  );
};

// Create Announcement Modal
const CreateAnnouncementModal = ({ isOpen, onClose, onSubmit, authToken }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scope: 'GLOBAL'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newAnnouncement = await response.json();
        onSubmit(newAnnouncement);
        onClose();
        setFormData({ title: '', content: '', scope: 'GLOBAL' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post announcement');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Announcement" size="lg">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="e.g., 📢 Important Update"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Content *</label>
          <textarea
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            rows={5}
            placeholder="Write your announcement..."
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Visibility</label>
          <select
            value={formData.scope}
            onChange={e => setFormData({...formData, scope: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="GLOBAL">🌍 All Users (Global)</option>
            <option value="GROUP">👥 Group Only</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
    </Modal>
  );
};

// Group Detail Modal (SRS FR7, FR8)
const GroupDetailModal = ({ group, isOpen, onClose, onJoin, isMember }) => {
  if (!isOpen || !group) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={group.name} size="lg">
      <div className="p-4">
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
          <Users size={48} className="text-white/50" />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
              {group.category || 'General'}
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            <Users size={14} className="inline mr-1" />
            {group.memberCount || 0} members
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{group.description}</p>
        
        {/* Group Features */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-700/50 p-3 rounded-xl text-center">
            <MessageSquare size={20} className="mx-auto text-purple-400 mb-1" />
            <span className="text-gray-400 text-xs">Discussions</span>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-xl text-center">
            <Calendar size={20} className="mx-auto text-blue-400 mb-1" />
            <span className="text-gray-400 text-xs">Events</span>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-xl text-center">
            <Bell size={20} className="mx-auto text-orange-400 mb-1" />
            <span className="text-gray-400 text-xs">Updates</span>
          </div>
        </div>
        
        {/* Recent Activity Placeholder */}
        <div className="bg-gray-700/30 rounded-xl p-4 mb-4">
          <h4 className="text-white font-semibold text-sm mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              New discussion posted yesterday
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              5 new members this week
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onJoin(group.id)}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            isMember 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
          }`}
        >
          {isMember ? 'Leave Group' : 'Join Group'}
        </button>
      </div>
    </Modal>
  );
};

// Comment Modal (SRS FR6 Enhancement)
const CommentModal = ({ announcement, isOpen, onClose, authToken }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && announcement) {
      fetchComments();
    }
  }, [isOpen, announcement]);
  
  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${announcement.id}/comments`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${announcement.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen || !announcement) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comments" size="md">
      <div className="p-4">
        {/* Original Post Preview */}
        <div className="bg-gray-700/30 rounded-xl p-3 mb-4">
          <p className="text-white font-semibold text-sm">{announcement.title}</p>
          <p className="text-gray-400 text-xs line-clamp-2">{announcement.content}</p>
        </div>
        
        {/* Comments List */}
        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center text-sm py-4">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-700/50 rounded-xl p-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                    {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">{comment.content}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* New Comment Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl transition disabled:opacity-50"
          >
            <Send size={18} className="text-white" />
          </button>
        </form>
      </div>
    </Modal>
  );
};

// Admin Dashboard Panel (SRS FR3 - ADMIN Role)
const AdminDashboard = ({ authToken, onApproveEvent }) => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [stats, setStats] = useState({ users: 0, events: 0, groups: 0, announcements: 0 });
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAdminData();
  }, []);
  
  const fetchAdminData = async () => {
    try {
      // Fetch pending events
      const eventsRes = await fetch(`${API_BASE_URL}/events?status=pending`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setPendingEvents(data.filter(e => !e.isApproved));
      }
      
      // Set mock stats for now
      setStats({
        users: 156,
        events: 24,
        groups: 12,
        announcements: 48
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(e => e.id !== eventId));
        onApproveEvent && onApproveEvent(eventId);
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
        <h3 className="text-white font-bold flex items-center mb-4">
          <Shield size={20} className="mr-2 text-yellow-400" />
          Admin Dashboard
        </h3>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Users size={20} className="mx-auto text-purple-400 mb-1" />
            <div className="text-white font-bold">{stats.users}</div>
            <div className="text-gray-400 text-xs">Users</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Calendar size={20} className="mx-auto text-blue-400 mb-1" />
            <div className="text-white font-bold">{stats.events}</div>
            <div className="text-gray-400 text-xs">Events</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Users size={20} className="mx-auto text-green-400 mb-1" />
            <div className="text-white font-bold">{stats.groups}</div>
            <div className="text-gray-400 text-xs">Groups</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <MessageSquare size={20} className="mx-auto text-orange-400 mb-1" />
            <div className="text-white font-bold">{stats.announcements}</div>
            <div className="text-gray-400 text-xs">Posts</div>
          </div>
        </div>
        
        {/* Pending Approvals */}
        <div className="bg-gray-800/50 rounded-xl p-3">
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center">
            <AlertCircle size={16} className="mr-2 text-yellow-400" />
            Pending Approvals ({pendingEvents.length})
          </h4>
          
          {pendingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">No pending items</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pendingEvents.slice(0, 5).map(event => (
                <div key={event.id} className="bg-gray-700/50 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{event.title}</p>
                    <p className="text-gray-400 text-xs">{event.category}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleApprove(event.id)}
                      className="p-1.5 bg-green-600 hover:bg-green-500 rounded-lg transition"
                    >
                      <CheckCircle size={14} className="text-white" />
                    </button>
                    <button className="p-1.5 bg-red-600 hover:bg-red-500 rounded-lg transition">
                      <XCircle size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Onboarding Flow Component
const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const steps = [
    {
      title: "Welcome to ToCampus! 🎓",
      description: "Your campus life, simplified. Discover events, connect with groups, and never miss important updates."
    },
    {
      title: "What interests you?",
      description: "Select your interests to personalize your feed."
    },
    {
      title: "You're all set! 🎉",
      description: "Start exploring your campus community now."
    }
  ];
  
  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('tocampus_onboarded', 'true');
      localStorage.setItem('tocampus_interests', JSON.stringify(selectedInterests));
      onComplete();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition ${
                i === step ? 'w-6 bg-purple-500' : i < step ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">{steps[step].title}</h1>
          <p className="text-gray-400">{steps[step].description}</p>
        </div>
        
        {/* Step Content */}
        {step === 0 && (
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Calendar size={32} className="mx-auto text-purple-400 mb-2" />
                <p className="text-white text-sm font-medium">Events</p>
              </div>
              <div>
                <Users size={32} className="mx-auto text-blue-400 mb-2" />
                <p className="text-white text-sm font-medium">Groups</p>
              </div>
              <div>
                <Bell size={32} className="mx-auto text-orange-400 mb-2" />
                <p className="text-white text-sm font-medium">Updates</p>
              </div>
            </div>
          </div>
        )}
        
        {step === 1 && (
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 mb-6 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {INTEREST_TAGS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleInterest(tag.id)}
                  className={`p-3 rounded-xl transition flex flex-col items-center ${
                    selectedInterests.includes(tag.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <tag.icon size={24} className="mb-1" />
                  <span className="text-xs">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <p className="text-gray-400">
              {selectedInterests.length > 0 
                ? `Great! We've saved ${selectedInterests.length} interests.`
                : "You can update your interests anytime in settings."}
            </p>
          </div>
        )}
        
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          {step < steps.length - 1 ? 'Continue' : 'Get Started'}
        </button>
        
        {step > 0 && step < steps.length - 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-3 text-gray-400 hover:text-white transition mt-2"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SRS v3.0 NEW COMPONENTS
// ============================================

// Marketplace Component (FR37-40)
const MarketplaceView = ({ authToken, currentUser }) => {
  const [listings, setListings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [showMessageModal, setShowMessageModal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, authToken]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`${API_BASE_URL}/marketplace?${params}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-bold flex items-center">
          <ShoppingBag size={24} className="mr-2 text-green-400" />
          Marketplace
        </h2>
        <button
          onClick={() => setShowCreateListing(true)}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl flex items-center text-sm font-semibold transition"
        >
          <Plus size={18} className="mr-1" />
          Sell Item
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:outline-none"
          />
        </div>
        <button type="submit" className="bg-gray-700 hover:bg-gray-600 px-4 rounded-xl transition">
          <Search size={20} className="text-white" />
        </button>
      </form>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {MARKETPLACE_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-50" />
          <p>No listings found</p>
          <p className="text-sm">Be the first to list an item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {listings.map(listing => (
            <div
              key={listing.id}
              onClick={() => setSelectedListing(listing)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition"
            >
              <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                <Package size={40} className="text-gray-500" />
              </div>
              <div className="p-3">
                <h4 className="text-white font-semibold text-sm truncate">{listing.title}</h4>
                <p className="text-green-400 font-bold text-lg">${listing.price}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {CONDITION_LABELS[listing.condition] || listing.condition}
                  </span>
                  <span className="text-xs text-gray-500">{listing.seller?.firstName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listing Detail Modal */}
      {selectedListing && (
        <Modal
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          title="Listing Details"
          size="md"
        >
          <div className="p-4">
            <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-4">
              <Package size={60} className="text-gray-500" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">{selectedListing.title}</h3>
            <p className="text-green-400 font-bold text-2xl mb-3">${selectedListing.price} CAD</p>
            <p className="text-gray-400 text-sm mb-4">{selectedListing.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-400 text-sm">
                <Tag size={16} className="mr-2" />
                Condition: {CONDITION_LABELS[selectedListing.condition]}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin size={16} className="mr-2" />
                Pickup: {selectedListing.pickupLocation || 'Contact seller'}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4">
              <p className="text-gray-400 text-xs mb-1">Seller</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {selectedListing.seller?.firstName?.[0]}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedListing.seller?.firstName} {selectedListing.seller?.lastName}
                  </p>
                </div>
              </div>
            </div>

            {selectedListing.sellerId !== currentUser?.id && (
              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                Message Seller
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
        authToken={authToken}
        onSuccess={() => {
          setShowCreateListing(false);
          fetchListings();
        }}
      />
    </div>
  );
};

// Create Listing Modal
const CreateListingModal = ({ isOpen, onClose, authToken, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'textbooks',
    condition: 'good',
    pickupLocation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.price || !formData.category) {
      setError('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        setFormData({ title: '', description: '', price: '', category: 'textbooks', condition: 'good', pickupLocation: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create listing');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Listing" size="md">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="text-gray-400 text-sm block mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none"
            placeholder="What are you selling?"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Price (CAD) *</label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none"
          >
            {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none"
          >
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none resize-none h-24"
            placeholder="Describe your item..."
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Pickup Location</label>
          <input
            type="text"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none"
            placeholder="e.g., Library, Student Center"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={20} /> : 'Post Listing'}
        </button>
      </form>
    </Modal>
  );
};

// Chatbot Component (FR44-47)
const ChatbotView = ({ authToken, currentUser }) => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'What events are happening?',
    'Show me clubs to join',
    'Browse marketplace'
  ]);

  const startConversation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/conversations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startConversation();
  }, [authToken]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !conversationId) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.botResponse.content,
          suggestions: data.botResponse.suggestions,
          relatedContent: data.botResponse.relatedContent
        }]);
        if (data.botResponse.suggestions) {
          setSuggestions(data.botResponse.suggestions);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <Bot size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Campus Assistant</h2>
            <p className="text-purple-200 text-sm">Ask me anything about campus life!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Bot size={48} className="mx-auto mb-3 opacity-50" />
            <p>Hi {currentUser?.firstName}! How can I help you today?</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'bg-gray-800 text-gray-200 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              
              {/* Related content chips */}
              {msg.relatedContent && msg.relatedContent.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.relatedContent.map((item, i) => (
                    <span
                      key={i}
                      className="bg-gray-700 text-purple-400 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-600"
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(suggestion)}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm whitespace-nowrap hover:bg-gray-700 transition"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl transition disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// ============================================
// ENHANCED NOTIFICATIONS VIEW (Production Ready)
// ============================================
const NotificationsView = ({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onDelete, 
  authToken,
  onNavigate 
}) => {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    events: true,
    announcements: true,
    groups: true,
    marketplace: true,
    social: true,
    sound: true,
    email: false
  });

  const NOTIFICATION_TYPES = [
    { id: 'all', label: 'All', icon: Inbox },
    { id: 'EVENT', label: 'Events', icon: Calendar, color: 'purple' },
    { id: 'ANNOUNCEMENT', label: 'Updates', icon: Megaphone, color: 'blue' },
    { id: 'GROUP', label: 'Groups', icon: Users, color: 'green' },
    { id: 'SOCIAL', label: 'Social', icon: Heart, color: 'pink' },
    { id: 'MARKETPLACE', label: 'Market', icon: ShoppingBag, color: 'orange' }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'EVENT_REMINDER':
      case 'EVENT_UPDATE':
      case 'EVENT_CANCELLED':
        return { icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/20' };
      case 'NEW_ANNOUNCEMENT':
      case 'ANNOUNCEMENT_UPDATE':
        return { icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'GROUP_INVITE':
      case 'GROUP_UPDATE':
      case 'GROUP_POST':
        return { icon: Users, color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'NEW_FOLLOWER':
      case 'MENTION':
      case 'LIKE':
        return { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/20' };
      case 'MARKETPLACE_MESSAGE':
      case 'LISTING_SOLD':
        return { icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-500/20' };
      default:
        return { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const getNotificationCategory = (type) => {
    if (type?.includes('EVENT')) return 'EVENT';
    if (type?.includes('ANNOUNCEMENT')) return 'ANNOUNCEMENT';
    if (type?.includes('GROUP')) return 'GROUP';
    if (type?.includes('FOLLOWER') || type?.includes('MENTION') || type?.includes('LIKE')) return 'SOCIAL';
    if (type?.includes('MARKETPLACE') || type?.includes('LISTING')) return 'MARKETPLACE';
    return 'OTHER';
  };

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => getNotificationCategory(n.type) === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart - 7 * 24 * 60 * 60 * 1000);

    filteredNotifications.forEach(n => {
      const date = new Date(n.createdAt);
      if (date >= todayStart) today.push(n);
      else if (date >= yesterdayStart) yesterday.push(n);
      else if (date >= weekStart) thisWeek.push(n);
      else older.push(n);
    });

    return { today, yesterday, thisWeek, older };
  }, [filteredNotifications]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const NotificationItem = ({ notification, onRead, onRemove }) => {
    const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
    
    return (
      <div 
        className={`relative flex items-start p-4 rounded-xl transition-all duration-200 cursor-pointer group ${
          notification.isRead 
            ? 'bg-gray-800/50 hover:bg-gray-800' 
            : 'bg-gray-800 hover:bg-gray-700 border-l-4 border-purple-500'
        }`}
        onClick={() => !notification.isRead && onRead(notification.id)}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${bg} rounded-xl flex items-center justify-center mr-3`}>
          <Icon size={20} className={color} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`font-semibold text-sm ${notification.isRead ? 'text-gray-400' : 'text-white'}`}>
              {notification.title}
            </p>
            <span className="text-gray-500 text-xs whitespace-nowrap ml-2">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
          <p className={`text-sm mt-1 line-clamp-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
            {notification.message}
          </p>
          
          {/* Action buttons on hover */}
          {notification.actionUrl && (
            <button className="mt-2 text-purple-400 text-xs font-medium hover:text-purple-300">
              View Details →
            </button>
          )}
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full" />
        )}

        {/* Delete button on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(notification.id); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700/0 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
        >
          <X size={14} className="text-gray-400 hover:text-red-400" />
        </button>
      </div>
    );
  };

  const NotificationGroup = ({ title, items }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification}
              onRead={onMarkRead}
              onRemove={onDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-white text-xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition"
            >
              <CheckCheck size={16} className="mr-1.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-slideDown">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Bell size={18} className="mr-2" />
            Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              { key: 'events', label: 'Events & Reminders', icon: Calendar },
              { key: 'announcements', label: 'Announcements', icon: Megaphone },
              { key: 'groups', label: 'Group Activity', icon: Users },
              { key: 'social', label: 'Social (Follows, Likes)', icon: Heart },
              { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            ].map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center text-gray-300">
                  <Icon size={16} className="mr-2 text-gray-500" />
                  {label}
                </span>
                <div 
                  onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notificationSettings[key] ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            ))}
            <div className="border-t border-gray-700 pt-3 mt-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center text-gray-300">
                  <Volume2 size={16} className="mr-2 text-gray-500" />
                  Sound
                </span>
                <div 
                  onClick={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notificationSettings.sound ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {NOTIFICATION_TYPES.map(type => {
          const Icon = type.icon;
          const count = type.id === 'all' 
            ? notifications.length 
            : notifications.filter(n => getNotificationCategory(n.type) === type.id).length;
          
          return (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition ${
                filter === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {type.label}
              {count > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === type.id ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BellOff size={32} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No notifications</p>
          <p className="text-gray-500 text-sm mt-1">
            {filter === 'all' 
              ? "You're all caught up!" 
              : `No ${filter.toLowerCase()} notifications`}
          </p>
        </div>
      ) : (
        <div>
          <NotificationGroup title="Today" items={groupedNotifications.today} />
          <NotificationGroup title="Yesterday" items={groupedNotifications.yesterday} />
          <NotificationGroup title="This Week" items={groupedNotifications.thisWeek} />
          <NotificationGroup title="Older" items={groupedNotifications.older} />
        </div>
      )}
    </div>
  );
};

// ============================================
// ENHANCED GROUPS VIEW (Production Ready)
// ============================================
const GroupsView = ({ 
  groups, 
  joinedGroups, 
  onJoinGroup, 
  onViewDetails,
  authToken,
  currentUser 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedGroup, setSelectedGroup] = useState(null);

  const GROUP_CATEGORIES = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'Academic', label: 'Academic', icon: BookOpen },
    { id: 'Sports', label: 'Sports', icon: Dumbbell },
    { id: 'Arts', label: 'Arts', icon: Palette },
    { id: 'Tech', label: 'Tech', icon: Code },
    { id: 'Social', label: 'Social', icon: Coffee },
    { id: 'Career', label: 'Career', icon: Target }
  ];

  const filteredGroups = useMemo(() => {
    let result = groups;
    
    if (filter === 'joined') {
      result = result.filter(g => joinedGroups.has(g.id));
    } else if (filter !== 'all') {
      result = result.filter(g => g.category === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.description?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [groups, joinedGroups, filter, searchQuery]);

  const myGroups = groups.filter(g => joinedGroups.has(g.id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-bold flex items-center">
          <Users size={24} className="mr-2 text-blue-400" />
          Groups
        </h2>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center text-sm font-semibold transition"
        >
          <Plus size={18} className="mr-1" />
          Create
        </button>
      </div>

      {/* My Groups Quick Access */}
      {myGroups.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-2">My Groups</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {myGroups.map(group => (
              <button
                key={group.id}
                onClick={() => onViewDetails(group)}
                className="flex-shrink-0 flex items-center bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{group.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups..."
          className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter('joined')}
          className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition ${
            filter === 'joined'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <CheckCircle size={16} className="mr-2" />
          Joined ({myGroups.length})
        </button>
        {GROUP_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition ${
                filter === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 font-medium">No groups found</p>
          <p className="text-gray-500 text-sm mt-1">
            {searchQuery ? 'Try a different search' : 'Be the first to create one!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map(group => (
            <div
              key={group.id}
              className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition cursor-pointer"
              onClick={() => onViewDetails(group)}
            >
              <div className="flex items-start">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Users size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{group.name}</h3>
                      <span className="text-gray-500 text-xs">{group.category}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onJoinGroup(group.id); }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                        joinedGroups.has(group.id)
                          ? 'bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {joinedGroups.has(group.id) ? 'Joined' : 'Join'}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{group.description}</p>
                  <div className="flex items-center mt-2 text-gray-500 text-xs">
                    <Users size={12} className="mr-1" />
                    {group.memberCount || 0} members
                    <span className="mx-2">•</span>
                    <Activity size={12} className="mr-1" />
                    Active today
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        authToken={authToken}
        onSuccess={() => {
          setShowCreateGroup(false);
          // Refresh groups list
        }}
      />
    </div>
  );
};

// Create Group Modal
const CreateGroupModal = ({ isOpen, onClose, authToken, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Social',
    privacy: 'public'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name) {
      setError('Group name is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        setFormData({ name: '', description: '', category: 'Social', privacy: 'public' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create group');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Group" size="md">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="text-gray-400 text-sm block mb-1">Group Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Photography Club"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts & Culture</option>
            <option value="Tech">Technology</option>
            <option value="Social">Social</option>
            <option value="Career">Career</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none resize-none h-24"
            placeholder="What's your group about?"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-2">Privacy</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, privacy: 'public' })}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                formData.privacy === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              🌍 Public
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, privacy: 'private' })}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                formData.privacy === 'private'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              🔒 Private
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={20} /> : 'Create Group'}
        </button>
      </form>
    </Modal>
  );
};

// ============================================
// QUICK ACCESS MENU (Marketplace, Assistant, More)
// ============================================
const QuickAccessMenu = ({ isOpen, onClose, onNavigate, currentUser }) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'text-green-400', desc: 'Buy & sell items' },
    { id: 'chat', label: 'Campus Assistant', icon: Bot, color: 'text-purple-400', desc: 'AI-powered help' },
    { id: 'discover', label: 'Discover', icon: Compass, color: 'text-blue-400', desc: 'Find new connections' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400', desc: 'App preferences' },
  ];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="absolute bottom-20 right-4 w-72 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Quick Access</h3>
          <p className="text-gray-500 text-sm">More features</p>
        </div>
        <div className="p-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center p-3 rounded-xl hover:bg-gray-700 transition text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center mr-3`}>
                  <Icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// User Profile View with Social Graph (FR34-36)
// eslint-disable-next-line no-unused-vars
const UserProfileView = ({ userId, authToken, currentUser, onBack }) => {
  const [profile, setProfile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method,
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        setIsFollowing(!isFollowing);
        setProfile(prev => ({
          ...prev,
          followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1
        }));
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-400">
        <User size={48} className="mx-auto mb-3 opacity-50" />
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-2xl p-6 mb-4 text-center">
        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-3">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            `${profile.firstName?.[0]}${profile.lastName?.[0]}`
          )}
        </div>
        <h2 className="text-white text-2xl font-bold mb-1">
          {profile.firstName} {profile.lastName}
        </h2>
        {profile.program && (
          <p className="text-purple-200">{profile.program} • Year {profile.yearOfStudy}</p>
        )}
        
        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{profile.followerCount || 0}</p>
            <p className="text-purple-200 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{profile.followingCount || 0}</p>
            <p className="text-purple-200 text-sm">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        {userId !== currentUser?.id && (
          <button
            onClick={handleFollow}
            className={`mt-4 px-6 py-2 rounded-xl font-semibold transition ${
              isFollowing
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-white text-purple-600 hover:bg-gray-100'
            }`}
          >
            {isFollowing ? (
              <span className="flex items-center">
                <UserCheck size={18} className="mr-2" />
                Following
              </span>
            ) : (
              <span className="flex items-center">
                <UserPlus size={18} className="mr-2" />
                Follow
              </span>
            )}
          </button>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <p className="text-gray-300">{profile.bio}</p>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Heart size={18} className="mr-2 text-pink-400" />
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => {
              const tag = INTEREST_TAGS.find(t => t.id === interest);
              return tag ? (
                <span key={interest} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center">
                  <tag.icon size={14} className="mr-1" />
                  {tag.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Contact / Social Links */}
      {profile.email && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Mail size={18} className="mr-2 text-blue-400" />
            Contact
          </h3>
          <p className="text-gray-400">{profile.email}</p>
        </div>
      )}
    </div>
  );
};

// Recommendation Feed Component (FR41-43)
const RecommendationFeed = ({ authToken, onViewEvent, onRSVP, rsvpedEvents }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRecommendations();
  }, [authToken]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/recommendations/events?limit=5`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Compass size={20} className="mr-2 text-purple-400" />
        Recommended for You
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {recommendations.map(event => (
            <div
              key={event.id}
              onClick={() => onViewEvent(event)}
              className="w-64 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-4 cursor-pointer hover:from-purple-800/50 hover:to-blue-800/50 transition border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400 text-xs font-medium">
                  {event.recommendationScore}% Match
                </span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs">
                  {event.category}
                </span>
              </div>
              <h4 className="text-white font-semibold mb-1 line-clamp-1">{event.title}</h4>
              <p className="text-gray-400 text-sm line-clamp-2 mb-2">{event.description}</p>
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar size={12} className="mr-1" />
                {new Date(event.startTime).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Splash Screen Component
const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const taglineTimer = setTimeout(() => setShowTagline(true), 500);
    const completeTimer = setTimeout(() => onComplete(), 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform animate-bounce-slow">
            <GraduationCap size={64} className="text-white" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-3xl blur-xl opacity-50 -z-10" />
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 mb-4 animate-fade-in">
          ToCampus
        </h1>

        {/* Tagline */}
        <p className={`text-gray-400 text-lg transition-all duration-700 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Your Campus. Connected.
        </p>

        {/* Progress Bar */}
        <div className="mt-12 w-64">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Login Screen Component (SRS FR1, FR3)
const LoginScreen = ({ onLogin, onSwitchToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) => {
    return email.endsWith('@ubishops.ca') || email.includes('@');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please use a valid university email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('tocampus_token', data.token);
      localStorage.setItem('tocampus_user', JSON.stringify(data.user));
      
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-400">Sign in to continue to ToCampus</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-shake">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">University Email</label>
              <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                focusedField === 'email' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
              }`}>
                <Mail size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@ubishops.ca"
                  className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">Password</label>
              <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                focusedField === 'password' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
              }`}>
                <Lock size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-white pl-12 pr-12 py-4 rounded-xl focus:outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold py-4 rounded-xl transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="px-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors border border-gray-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors border border-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Demo Accounts Info */}
        <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-xs text-center mb-2">Demo Accounts (password: password123)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['student@ubishops.ca', 'staff@ubishops.ca', 'admin@ubishops.ca'].map((email) => (
              <button
                key={email}
                onClick={() => setEmail(email)}
                className="text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg transition-colors"
              >
                {email.split('@')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Screen Component (SRS FR1, FR3 - Role-Based Access)
const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const roles = [
    { id: 'STUDENT', name: 'Student', icon: GraduationCap, description: 'Access events, join groups, view announcements' },
    { id: 'STAFF', name: 'Staff', icon: Building, description: 'Create events, post announcements, manage groups' },
    { id: 'FACULTY', name: 'Faculty', icon: UserCheck, description: 'Full access with academic features' }
  ];

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid university email');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('tocampus_token', data.token);
      localStorage.setItem('tocampus_user', JSON.stringify(data.user));
      
      onRegister(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join the ToCampus community</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= s 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${
                  step > s ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-shake">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-white text-lg font-semibold mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">First Name</label>
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                    focusedField === 'firstName' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                  }`}>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John"
                      className="w-full bg-transparent text-white px-4 py-3 rounded-xl focus:outline-none placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Last Name</label>
                  <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                    focusedField === 'lastName' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                  }`}>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Doe"
                      className="w-full bg-transparent text-white px-4 py-3 rounded-xl focus:outline-none placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">University Email</label>
                <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === 'email' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                }`}>
                  <Mail size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@ubishops.ca"
                    className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-white text-lg font-semibold mb-4">Create Password</h2>
              
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Password</label>
                <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === 'password' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                }`}>
                  <Lock size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent text-white pl-12 pr-12 py-3 rounded-xl focus:outline-none placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Confirm Password</label>
                <div className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === 'confirmPassword' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                }`}>
                  <Lock size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    focusedField === 'confirmPassword' ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password strength indicator */}
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        formData.password.length >= level * 3 
                          ? level <= 2 ? 'bg-orange-500' : 'bg-green-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {formData.password.length === 0 ? 'Enter a password' :
                   formData.password.length < 6 ? 'Too short' :
                   formData.password.length < 10 ? 'Good' : 'Strong'}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Role Selection (SRS FR3) */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-white text-lg font-semibold mb-4">Select Your Role</h2>
              <p className="text-gray-400 text-sm mb-4">Choose the role that best describes you</p>
              
              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setFormData({...formData, role: role.id})}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        formData.role === role.id
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          formData.role === role.id
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                            : 'bg-gray-700'
                        }`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{role.name}</h3>
                          <p className="text-gray-400 text-sm">{role.description}</p>
                        </div>
                        {formData.role === role.id && (
                          <CheckCircle size={24} className="text-purple-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex space-x-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold py-4 rounded-xl transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <span>{step === 3 ? 'Create Account' : 'Continue'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Screen (SRS FR2)
const ForgotPasswordScreen = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Login</span>
        </button>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                  <Lock size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-gray-400 text-sm">Enter your email and we'll send you instructions to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <AlertCircle size={20} className="text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Email Address</label>
                  <div className="relative rounded-xl border-2 border-gray-700 focus-within:border-purple-500 transition-all">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@ubishops.ca"
                      className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none placeholder-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30"
                >
                  {isLoading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-6">
                We've sent password reset instructions to<br />
                <span className="text-purple-400 font-medium">{email}</span>
              </p>
              <button
                onClick={onBack}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT (Integrates Auth Flow)
// ============================================

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Components
const MobileHeader = ({ title, onMenuClick, showBack, onBack }) => (
  <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
    <div className="flex items-center justify-between px-4 py-3">
      {showBack ? (
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition">
          <X size={24} />
        </button>
      ) : (
        <button onClick={onMenuClick} className="p-2 hover:bg-white/10 rounded-lg transition">
          <Menu size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="w-10" />
    </div>
  </div>
);

const BottomNav = ({ activeTab, onTabChange, unreadNotifications = 0 }) => {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'notifications', icon: Bell, label: 'Alerts', badge: unreadNotifications },
    { id: 'profile', icon: User, label: 'Profile' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EventCard = ({ event, onRSVP, hasRSVPed, onViewDetails, onShare }) => {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl mb-4 hover:shadow-purple-500/20 transition-shadow">
      <div 
        className="h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-orange-500 relative cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(event)}
      >
        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
          {event.category}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur px-2 py-1 rounded-lg">
          <span className="text-white text-xs">Tap for details</span>
        </div>
      </div>
      <div className="p-4">
        <h3 
          className="text-white font-bold text-lg mb-2 cursor-pointer hover:text-purple-400 transition"
          onClick={() => onViewDetails && onViewDetails(event)}
        >
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Clock size={16} className="mr-2 text-blue-400" />
            {formatDate(event.startTime)} at {formatTime(event.startTime)}
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin size={16} className="mr-2 text-orange-400" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Users size={16} className="mr-2 text-purple-400" />
            {event.attendeeCount || 0} attending
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onRSVP(event.id)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              hasRSVPed
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {hasRSVPed ? (
              <span className="flex items-center justify-center">
                <CheckCircle size={20} className="mr-2" />
                You're Going
              </span>
            ) : (
              'RSVP Now'
            )}
          </button>
          <button
            onClick={() => onShare && onShare(event)}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
            title="Share"
          >
            <Share2 size={18} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ announcement, onLike, onComment, onShare, isLiked }) => {
  const author = announcement.author || { firstName: 'Staff', lastName: 'Member' };
  
  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-xl mb-4 hover:shadow-purple-500/20 transition-shadow">
      <div className="flex items-start mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {author.firstName?.charAt(0) || 'S'}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold">{author.firstName} {author.lastName}</h4>
          <p className="text-gray-400 text-xs">{timeAgo(announcement.createdAt)}</p>
        </div>
      </div>
      
      <h3 className="text-white font-bold text-lg mb-2">{announcement.title}</h3>
      <p className="text-gray-300 text-sm mb-4">{announcement.content}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <button
          onClick={() => onLike(announcement.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            isLiked
              ? 'text-yellow-400 bg-yellow-400/10'
              : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
          }`}
        >
          <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{(announcement.likeCount || 0) + (isLiked ? 1 : 0)}</span>
        </button>
        
        <button
          onClick={() => onComment(announcement)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{announcement.commentCount || 0}</span>
        </button>
        
        <button 
          onClick={() => onShare && onShare(announcement)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-700 transition"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const GroupCard = ({ group, onJoin, onViewDetails, isMember }) => (
  <div 
    className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl mb-4 hover:shadow-purple-500/20 transition-shadow cursor-pointer"
    onClick={() => onViewDetails && onViewDetails(group)}
  >
    <div className="h-24 bg-gradient-to-br from-orange-500 via-yellow-500 to-purple-500" />
    <div className="p-4">
      <h3 className="text-white font-bold text-lg mb-1">{group.name}</h3>
      <p className="text-gray-400 text-sm mb-3">{group.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm">
          <Users size={16} className="inline mr-1 text-purple-400" />
          {group.memberCount || 0} members
        </span>
        <button
          onClick={() => onJoin(group.id)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isMember
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {isMember ? 'Joined' : 'Join'}
        </button>
      </div>
    </div>
  </div>
);

// eslint-disable-next-line no-unused-vars
const NotificationItem = ({ notification, onMarkRead }) => {
  const icons = {
    EVENT_REMINDER: Calendar,
    NEW_ANNOUNCEMENT: MessageSquare,
    RSVP_CONFIRMATION: CheckCircle
  };
  
  const Icon = icons[notification.type] || Bell;
  
  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`p-4 rounded-xl mb-2 transition cursor-pointer ${
        notification.isRead
          ? 'bg-gray-800'
          : 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30'
      }`}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-3 ${notification.isRead ? 'bg-gray-700' : 'bg-purple-600'}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm mb-1">{notification.title}</h4>
          <p className="text-gray-400 text-xs">{notification.message}</p>
          <p className="text-gray-500 text-xs mt-1">{timeAgo(notification.createdAt)}</p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
        )}
      </div>
    </div>
  );
};

// Main App Component
const ToCampusApp = () => {
  // Authentication State
  const [authState, setAuthState] = useState('splash'); // splash, login, register, forgotPassword, onboarding, authenticated
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // App State
  const [activeTab, setActiveTab] = useState('feed');
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [rsvpedEvents, setRsvpedEvents] = useState(new Set());
  const [likedAnnouncements, setLikedAnnouncements] = useState(new Set());
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Data from backend
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [shareType, setShareType] = useState('event');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('tocampus_token');
    const user = localStorage.getItem('tocampus_user');
    
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setAuthState('authenticated');
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };

      // Fetch events
      const eventsRes = await fetch(`${API_BASE_URL}/events`, { headers });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      // Fetch announcements
      const announcementsRes = await fetch(`${API_BASE_URL}/announcements`, { headers });
      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData);
      }

      // Fetch groups
      const groupsRes = await fetch(`${API_BASE_URL}/groups`, { headers });
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData);
      }

      // Fetch notifications
      const notificationsRes = await fetch(`${API_BASE_URL}/notifications`, { headers });
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use fallback mock data if API fails
      initializeMockData();
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  // Fetch data when authenticated
  useEffect(() => {
    if (authState === 'authenticated' && authToken) {
      fetchAllData();
    }
  }, [authState, authToken, fetchAllData]);
  
  // Filter events by category
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);
  
  // Filter announcements by search
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(ann => {
      return !searchQuery || 
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [announcements, searchQuery]);
  
  // Filter groups by search
  // eslint-disable-next-line no-unused-vars
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      return !searchQuery || 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [groups, searchQuery]);

  // Initialize fallback mock data with rich content
  const initializeMockData = () => {
    setEvents([
      {
        id: 'evt_001',
        title: 'Welcome Fair 2025',
        description: 'Discover clubs and resources at the annual welcome fair. Meet new friends, explore opportunities, and get involved in campus life! Free food and giveaways.',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Campus Quad',
        category: 'Social',
        attendeeCount: 124,
        creator: { firstName: 'Student', lastName: 'Affairs' }
      },
      {
        id: 'evt_002',
        title: 'Career Workshop: Resume Building',
        description: 'Learn how to craft the perfect resume with industry professionals. Bring your laptop and current resume for hands-on feedback.',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Career Center, Room 201',
        category: 'Academic',
        attendeeCount: 45,
        creator: { firstName: 'Career', lastName: 'Services' }
      },
      {
        id: 'evt_003',
        title: 'Basketball Tournament Finals',
        description: 'Cheer on your favorite intramural teams as they compete for the championship title! Refreshments provided.',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        location: 'Sports Complex Gymnasium',
        category: 'Sports',
        attendeeCount: 89,
        creator: { firstName: 'Athletics', lastName: 'Department' }
      }
    ]);
    
    setAnnouncements([
      {
        id: 'ann_001',
        title: '📚 Library Extended Hours for Finals',
        content: 'Great news! The John Chicken Library will be open 24/7 during finals week (Dec 9-20). Quiet study zones, group study rooms, and free coffee available after 10 PM. Good luck on your exams!',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likeCount: 156,
        commentCount: 23,
        author: { firstName: 'Library', lastName: 'Services' }
      },
      {
        id: 'ann_002',
        title: '🎉 Winter Break Shuttle Service',
        content: 'Free shuttle service to Montreal and Sherbrooke airports will run Dec 15-22. Book your seat through the Student Portal by Dec 10. Limited spots available!',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        likeCount: 89,
        commentCount: 12,
        author: { firstName: 'Transportation', lastName: 'Office' }
      },
      {
        id: 'ann_003',
        title: '🍕 Free Pizza Friday This Week!',
        content: 'Join us this Friday at the Student Union Building for Free Pizza Friday! All students welcome. Starts at 12 PM while supplies last. Vegetarian and gluten-free options available.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        likeCount: 234,
        commentCount: 45,
        author: { firstName: 'Student', lastName: 'Union' }
      }
    ]);
    
    setGroups([
      {
        id: 'grp_001',
        name: 'Chess Club',
        description: 'Weekly meetings for chess enthusiasts of all skill levels. Tournaments, casual games, and lessons available.',
        category: 'Recreation',
        memberCount: 47
      },
      {
        id: 'grp_002',
        name: 'Photography Society',
        description: 'Capture campus life! Photo walks, editing workshops, and exhibitions. Camera not required - phone photography welcome!',
        category: 'Arts',
        memberCount: 82
      },
      {
        id: 'grp_003',
        name: 'Computer Science Club',
        description: 'Hackathons, coding challenges, tech talks, and networking with industry professionals. All majors welcome!',
        category: 'Academic',
        memberCount: 156
      }
    ]);
    
    setNotifications([
      {
        id: 'notif_001',
        type: 'EVENT_REMINDER',
        title: '⏰ Event Reminder',
        message: 'Career Workshop: Resume Building starts in 3 days. Don\'t forget to bring your laptop!',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_002',
        type: 'NEW_ANNOUNCEMENT',
        title: '📢 New Announcement',
        message: 'Library Services posted: Library Extended Hours for Finals',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_003',
        type: 'GROUP_UPDATE',
        title: '👥 Group Activity',
        message: 'Computer Science Club: New hackathon registration is now open!',
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]);
  };

  // Auth handlers
  const handleSplashComplete = useCallback(() => {
    const token = localStorage.getItem('tocampus_token');
    if (token) {
      setAuthState('authenticated');
    } else {
      setAuthState('login');
    }
  }, []);

  const handleLogin = useCallback((user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setAuthState('authenticated');
  }, []);

  const handleRegister = useCallback((user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setAuthState('authenticated');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('tocampus_token');
    localStorage.removeItem('tocampus_user');
    setCurrentUser(null);
    setAuthToken(null);
    setAuthState('login');
    setEvents([]);
    setAnnouncements([]);
    setGroups([]);
    setNotifications([]);
  }, []);
  
  const handleRSVP = async (eventId) => {
    try {
      await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'GOING' })
      });
    } catch (error) {
      console.error('RSVP error:', error);
    }

    setRsvpedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };
  
  const handleLike = (announcementId) => {
    setLikedAnnouncements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(announcementId)) {
        newSet.delete(announcementId);
      } else {
        newSet.add(announcementId);
      }
      return newSet;
    });
  };
  
  const handleJoinGroup = async (groupId) => {
    try {
      await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Join group error:', error);
    }

    setJoinedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };
  
  const handleMarkRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Get avatar for user
  const getAvatar = (role) => {
    switch (role) {
      case 'ADMIN': return '👤';
      case 'STAFF': return '👨‍🏫';
      case 'FACULTY': return '👨‍🎓';
      default: return '🎓';
    }
  };
  
  // Modal handlers
  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
  };
  
  const handleViewGroupDetails = (group) => {
    setSelectedGroup(group);
  };
  
  const handleOpenComments = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowComments(true);
  };
  
  const handleShare = (item, type = 'event') => {
    setShareItem(item);
    setShareType(type);
  };
  
  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    fetchAllData(); // Refresh to get latest data
  };
  
  const handleAnnouncementCreated = (newAnnouncement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    fetchAllData();
  };

  // Render authentication screens
  if (authState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  if (authState === 'onboarding') {
    return <OnboardingFlow onComplete={() => setAuthState('authenticated')} />;
  }

  if (authState === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthState('register')}
        onForgotPassword={() => setAuthState('forgotPassword')}
      />
    );
  }

  if (authState === 'register') {
    return (
      <RegisterScreen 
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthState('login')}
      />
    );
  }

  if (authState === 'forgotPassword') {
    return (
      <ForgotPasswordScreen 
        onBack={() => setAuthState('login')}
      />
    );
  }

  // Main App (Authenticated)
  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <MobileHeader
        title="ToCampus"
        onMenuClick={() => setShowMenu(!showMenu)}
        showBack={false}
      />
      
      {/* All Modals */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRSVP={handleRSVP}
        hasRSVPed={selectedEvent ? rsvpedEvents.has(selectedEvent.id) : false}
        onShare={() => {
          handleShare(selectedEvent, 'event');
          setSelectedEvent(null);
        }}
      />
      
      <GroupDetailModal
        group={selectedGroup}
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        onJoin={handleJoinGroup}
        isMember={selectedGroup ? joinedGroups.has(selectedGroup.id) : false}
      />
      
      <ShareModal
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        item={shareItem}
        type={shareType}
      />
      
      <CommentModal
        announcement={selectedAnnouncement}
        isOpen={showComments}
        onClose={() => {
          setShowComments(false);
          setSelectedAnnouncement(null);
        }}
        authToken={authToken}
      />
      
      <CreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onSubmit={handleEventCreated}
        authToken={authToken}
      />
      
      <CreateAnnouncementModal
        isOpen={showCreateAnnouncement}
        onClose={() => setShowCreateAnnouncement(false)}
        onSubmit={handleAnnouncementCreated}
        authToken={authToken}
      />
      
      {/* Side Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowMenu(false)}>
          <div className="bg-gray-800 w-72 h-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-3">
                {getAvatar(currentUser?.role)}
              </div>
              <h3 className="text-white font-bold text-lg">{currentUser?.firstName} {currentUser?.lastName}</h3>
              <p className="text-gray-400 text-sm">{currentUser?.email}</p>
              <div className="mt-2 inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
                {currentUser?.role}
              </div>
            </div>
            
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 rounded-xl transition flex items-center">
                <Settings size={20} className="mr-3 text-gray-400" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition flex items-center"
              >
                <LogOut size={20} className="mr-3" />
                Log Out
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCw size={40} className="text-purple-500 animate-spin mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="px-4 py-4 max-w-2xl mx-auto">
        {activeTab === 'feed' && (
          <div>
            {/* Recommendations Section (FR41-43) */}
            <RecommendationFeed
              authToken={authToken}
              onViewEvent={handleViewEventDetails}
              onRSVP={handleRSVP}
              rsvpedEvents={rsvpedEvents}
            />
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Latest Updates</h2>
              {['STAFF', 'FACULTY', 'ADMIN'].includes(currentUser?.role) && (
                <button
                  onClick={() => setShowCreateAnnouncement(true)}
                  className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl transition"
                  title="Post Announcement"
                >
                  <Plus size={20} className="text-white" />
                </button>
              )}
            </div>
            
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
                <p>No announcements yet</p>
              </div>
            ) : (
              filteredAnnouncements.map(announcement => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onLike={handleLike}
                  onComment={handleOpenComments}
                  onShare={(ann) => handleShare(ann, 'announcement')}
                  isLiked={likedAnnouncements.has(announcement.id)}
                />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'events' && (
          <div>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {EVENT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">
                {selectedCategory === 'all' ? 'All Events' : `${selectedCategory} Events`}
                <span className="text-gray-400 text-sm font-normal ml-2">({filteredEvents.length})</span>
              </h2>
              {['STAFF', 'FACULTY', 'ADMIN'].includes(currentUser?.role) && (
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl transition"
                  title="Create Event"
                >
                  <Plus size={20} className="text-white" />
                </button>
              )}
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                <p>{searchQuery || selectedCategory !== 'all' ? 'No events match your filters' : 'No upcoming events'}</p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRSVP={handleRSVP}
                  hasRSVPed={rsvpedEvents.has(event.id)}
                  onViewDetails={handleViewEventDetails}
                  onShare={(evt) => handleShare(evt, 'event')}
                />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'groups' && (
          <GroupsView
            groups={groups}
            joinedGroups={joinedGroups}
            onJoinGroup={handleJoinGroup}
            onViewDetails={handleViewGroupDetails}
            authToken={authToken}
            currentUser={currentUser}
          />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onDelete={handleDeleteNotification}
            authToken={authToken}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        
        {activeTab === 'profile' && (
          <div>
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-2xl p-6 mb-6 text-center shadow-xl">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-3">
                {getAvatar(currentUser?.role)}
              </div>
              <h2 className="text-white text-2xl font-bold mb-1">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-purple-200">{currentUser?.email}</p>
              <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full text-white text-sm font-semibold">
                {currentUser?.role}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Your Activity</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-700/50 rounded-xl p-3">
                    <div className="text-purple-400 font-bold text-2xl">{rsvpedEvents.size}</div>
                    <div className="text-gray-400 text-xs">Events</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-3">
                    <div className="text-blue-400 font-bold text-2xl">{joinedGroups.size}</div>
                    <div className="text-gray-400 text-xs">Groups</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-3">
                    <div className="text-yellow-400 font-bold text-2xl">{likedAnnouncements.size}</div>
                    <div className="text-gray-400 text-xs">Likes</div>
                  </div>
                </div>
              </div>
              
              {/* Admin Dashboard (SRS FR3) */}
              {currentUser?.role === 'ADMIN' && (
                <AdminDashboard authToken={authToken} onApproveEvent={(id) => fetchAllData()} />
              )}

              {/* Role-based features (SRS FR3) */}
              {['STAFF', 'FACULTY', 'ADMIN'].includes(currentUser?.role) && (
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Sparkles size={18} className="mr-2 text-yellow-400" />
                    Staff Features
                  </h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setShowCreateEvent(true)}
                      className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-gray-700 rounded-xl text-white transition flex items-center"
                    >
                      <Plus size={18} className="mr-3 text-purple-400" />
                      Create Event
                    </button>
                    <button 
                      onClick={() => setShowCreateAnnouncement(true)}
                      className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-gray-700 rounded-xl text-white transition flex items-center"
                    >
                      <MessageSquare size={18} className="mr-3 text-blue-400" />
                      Post Announcement
                    </button>
                  </div>
                </div>
              )}
              
              {/* Quick Access Buttons */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <MoreHorizontal size={18} className="mr-2 text-gray-400" />
                  More Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                    className="flex flex-col items-center p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition"
                  >
                    <ShoppingBag size={24} className="text-green-400 mb-1" />
                    <span className="text-white text-sm">Marketplace</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="flex flex-col items-center p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition"
                  >
                    <Bot size={24} className="text-purple-400 mb-1" />
                    <span className="text-white text-sm">Assistant</span>
                  </button>
                </div>
              </div>
              
              {/* User Interests Section */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-pink-400" />
                  Your Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(localStorage.getItem('tocampus_interests') || '[]').length > 0 ? (
                    JSON.parse(localStorage.getItem('tocampus_interests') || '[]').map(interest => {
                      const tag = INTEREST_TAGS.find(t => t.id === interest);
                      return tag ? (
                        <span key={interest} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center">
                          <tag.icon size={14} className="mr-1" />
                          {tag.label}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No interests selected yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <MarketplaceView authToken={authToken} currentUser={currentUser} />
        )}
        
        {/* Chat/Assistant Tab */}
        {activeTab === 'chat' && (
          <ChatbotView authToken={authToken} currentUser={currentUser} />
        )}
      </div>
      
      {/* Quick Access Menu Floating Button - only show on main tabs */}
      {['feed', 'events', 'groups', 'profile'].includes(activeTab) && (
        <button
          onClick={() => setShowQuickAccess(true)}
          className="fixed bottom-24 right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 transition-transform"
        >
          <MoreHorizontal size={24} className="text-white" />
        </button>
      )}
      
      <QuickAccessMenu 
        isOpen={showQuickAccess} 
        onClose={() => setShowQuickAccess(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
      />
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        unreadNotifications={unreadCount}
      />
    </div>
  );
};

export default ToCampusApp;
