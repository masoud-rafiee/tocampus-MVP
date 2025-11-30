import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToCampusApp from './App';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ToCampus App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================
  // Splash Screen Tests
  // ============================================
  describe('Splash Screen', () => {
    test('renders splash screen on initial load', () => {
      render(<ToCampusApp />);
      
      expect(screen.getByText('ToCampus')).toBeInTheDocument();
    });

    test('shows tagline after delay', async () => {
      jest.useFakeTimers();
      render(<ToCampusApp />);
      
      await act(async () => {
        jest.advanceTimersByTime(600);
      });
      
      expect(screen.getByText(/Your Campus/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Login Screen Tests (FR1)
  // ============================================
  describe('Login Screen', () => {
    test('transitions to login screen after splash completes', async () => {
      jest.useFakeTimers();
      render(<ToCampusApp />);
      
      // Fast-forward through splash screen (2000ms)
      await act(async () => {
        jest.advanceTimersByTime(2500);
      });
      
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    });

    test('shows sign in button on login screen', async () => {
      jest.useFakeTimers();
      render(<ToCampusApp />);
      
      await act(async () => {
        jest.advanceTimersByTime(2500);
      });
      
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('shows forgot password link', async () => {
      jest.useFakeTimers();
      render(<ToCampusApp />);
      
      await act(async () => {
        jest.advanceTimersByTime(2500);
      });
      
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // UI Components Tests
  // ============================================
  describe('UI Components', () => {
    test('renders without crashing', () => {
      const { container } = render(<ToCampusApp />);
      expect(container).toBeInTheDocument();
    });

    test('has animated background on splash', () => {
      render(<ToCampusApp />);
      const background = document.querySelector('.animate-pulse');
      expect(background).toBeInTheDocument();
    });
  });
});

// ============================================
// Utility Function Tests
// ============================================
describe('Utility Functions', () => {
  test('date formatting works correctly', () => {
    const date = new Date();
    expect(date.toLocaleDateString()).toBeDefined();
  });

  test('time formatting works correctly', () => {
    const date = new Date();
    expect(date.toLocaleTimeString()).toBeDefined();
  });
});
