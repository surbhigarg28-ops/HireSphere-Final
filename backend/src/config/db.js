import mongoose from 'mongoose';import {env} from './env.js';
export async function connectDB(){try{await mongoose.connect(env.mongoUri);console.log('MongoDB connected');}catch(e){console.error('MongoDB connection failed:',e.message);process.exit(1)}}
