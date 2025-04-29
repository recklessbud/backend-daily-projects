const express = require('express');
const Redis = require('ioredis');
const { default: envVariables } = require('./env.config');
// IMPORTANT: Get the cache endpoint from environment variables
const cacheEndpoint = envVariables.ELASTICACHE_REDIS_URL;
const cachePort = envVariables.REDIS_PORT|| 6379; // Default Redis port

if (!cacheEndpoint) {
    console.error("FATAL ERROR: CACHE_ENDPOINT environment variable is not set.");
    // In a real app, you might want to prevent the app from starting
    // or handle this more gracefully depending on cache necessity.
}

// Configure Redis Client
// Enable TLS if you enabled encryption in-transit on ElastiCache
const redisOptions = {
    host: cacheEndpoint,
    port: cachePort,
    tls: {}, // Enable TLS - adjust if using custom certs
    // Add password if you configured Redis AUTH
    // password: process.env.CACHE_PASSWORD,
    lazyConnect: true, // Connect lazily
    showFriendlyErrorStack: true, // Good for debugging
    connectTimeout: 10000, // 10 seconds
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            // Only reconnect when the replica changes roles
            return true; // or 'built-in';
        }
        return false; // Do not reconnect for other errors by default
    }
};

// Conditionally create client only if endpoint exists
let redisClient;
if (cacheEndpoint) {
   console.log(`Initializing Redis client for endpoint: <span class="math-inline">${cacheEndpoint}:</span>${cachePort}`);
   redisClient = new Redis(redisOptions);

   redisClient.on('connect', () => console.log('Redis client connected'));
   redisClient.on('ready', () => console.log('Redis client ready'));
   redisClient.on('error', (err) => console.error('Redis Client Error:', err));
   redisClient.on('reconnecting', () => console.log('Redis client reconnecting'));
   redisClient.on('end', () => console.log('Redis client connection ended'));

} else {
   console.warn("CACHE_ENDPOINT not set, Redis client not initialized.");
   // Create a dummy client or implement logic to bypass cache
   redisClient = {
     get: async () => null,
     set: async () => {},
     // Add other methods you use as dummies
   };
}

module.exports = {redisClient};