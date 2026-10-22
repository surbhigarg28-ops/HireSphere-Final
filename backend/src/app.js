import express from 'express';import cors from 'cors';import helmet from 'helmet';import morgan from 'morgan';import rateLimit from 'express-rate-limit';
import {env} from './config/env.js';import routes from './routes/index.js';import {notFound,errorHandler} from './middleware/error.js';
const app=express();app.use(helmet());
app.use(cors({origin:(o,cb)=>(!o||env.clientUrls.includes(o))?cb(null,true):cb(new Error('Not allowed by CORS')),methods:['GET','POST','PUT','PATCH','DELETE'],allowedHeaders:['Content-Type','Authorization']}));
app.use(express.json({limit:'100kb'}));if(env.nodeEnv!=='test')app.use(morgan('dev'));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:true,message:{success:false,message:'Too many attempts, try again later'}}));
app.use('/api',routes);app.use(notFound);app.use(errorHandler);export default app;
