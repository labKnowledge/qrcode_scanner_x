// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 10, // 10 requests per window
  },
  
  // File upload limits
  FILE_LIMITS: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  },
  
  // API Security
  API: {
    REQUIRE_AUTH: process.env.NODE_ENV === 'production',
    CORS_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  
  // Logging
  LOGGING: {
    STORE_IP: false, // Set to true only if needed for analytics
    STORE_QR_CONTENT: false, // For privacy, don't store QR content in production
    MAX_LOG_RETENTION_DAYS: 30,
  },
};

// Environment Variables Guide (create .env.local with these):
export const ENV_VARS_GUIDE = {
  REQUIRED: [
    'MONGODB_URI', // Your MongoDB connection string
    'API_KEY_1', // Server API key #1
    'API_KEY_2', // Server API key #2
    'NEXT_PUBLIC_API_KEY', // Client-side API key
  ],
  OPTIONAL: [
    'NODE_ENV', // production/development
    'ALLOWED_ORIGINS', // Comma-separated list of allowed CORS origins
  ],
};

// Security Headers for production
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
}; 