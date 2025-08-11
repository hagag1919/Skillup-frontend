// Formatting utilities

export const formatters = {
  // Date formatting
  formatDate: (date: string | Date): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  formatDateTime: (date: string | Date): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatRelativeTime: (date: string | Date): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatters.formatDate(date);
    }
  },

  // Duration formatting
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },

  formatDurationHuman: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  // Number formatting
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  },

  formatRating: (rating: number): string => {
    return rating.toFixed(1);
  },

  formatPercentage: (value: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  },

  // Text formatting
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  capitalizeFirst: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  formatCurrency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // URL formatting
  createSlug: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // File size formatting
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

// Validation utilities
export const validators = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Required field validation
  isRequired: (value: string | number | null | undefined): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  // Length validation
  hasMinLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  },

  hasMaxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  },

  // Number validation
  isPositiveNumber: (value: number): boolean => {
    return !isNaN(value) && value > 0;
  },

  isWholeNumber: (value: number): boolean => {
    return Number.isInteger(value) && value >= 0;
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Form validation helper
  validateForm: (data: Record<string, unknown>, rules: Record<string, Array<(value: unknown) => boolean | string>>): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const fieldRules = rules[field];

      for (const rule of fieldRules) {
        const result = rule(value);
        if (typeof result === 'string') {
          errors[field] = result;
          break;
        } else if (result === false) {
          errors[field] = `Invalid ${field}`;
          break;
        }
      }
    });

    return errors;
  },
};

// Common validation rules
export const validationRules = {
  required: (fieldName: string) => (value: unknown) => {
    if (typeof value === 'string' && value.trim() === '') {
      return `${fieldName} is required`;
    }
    if (value === null || value === undefined) {
      return `${fieldName} is required`;
    }
    return true;
  },

  email: () => (value: unknown) => {
    if (typeof value === 'string' && !validators.isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  password: () => (value: unknown) => {
    if (typeof value === 'string' && !validators.isValidPassword(value)) {
      return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    return true;
  },

  minLength: (min: number) => (value: unknown) => {
    if (typeof value === 'string' && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return true;
  },

  maxLength: (max: number) => (value: unknown) => {
    if (typeof value === 'string' && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return true;
  },

  url: () => (value: unknown) => {
    if (typeof value === 'string' && value && !validators.isValidUrl(value)) {
      return 'Please enter a valid URL';
    }
    return true;
  },

  positiveNumber: () => (value: unknown) => {
    if (typeof value === 'number' && !validators.isPositiveNumber(value)) {
      return 'Must be a positive number';
    }
    return true;
  },
};
