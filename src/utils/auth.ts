import { NextRequest } from 'next/server';

// Simple API key authentication (in production, use more robust methods)
const API_KEYS = new Set([
  process.env.API_KEY_1 || 'your-secure-api-key-1',
  process.env.API_KEY_2 || 'your-secure-api-key-2',
]);

export function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return false;
  }
  
  return API_KEYS.has(apiKey);
}

export function createClientHeaders(): HeadersInit {
  // Client-side header for API requests
  return {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-secure-api-key-1',
    'Content-Type': 'application/json',
  };
} 