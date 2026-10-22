import 'dotenv/config';
const need=k=>{if(!process.env[k])throw new Error(`Missing required environment variable ${k}. Copy .env.example to .env and set it.`);return process.env[k]};
const secret=need('JWT_SECRET');if(secret.length<16)throw new Error('JWT_SECRET must be at least 16 characters.');
export const env={port:+process.env.PORT||5000,nodeEnv:process.env.NODE_ENV||'development',mongoUri:need('MONGODB_URI'),jwtSecret:secret,jwtExpires:process.env.JWT_EXPIRES_IN||'7d',
clientUrls:(process.env.CLIENT_URL||'http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean)};
