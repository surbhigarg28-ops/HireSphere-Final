import {ZodError} from 'zod';import {env} from '../config/env.js';
export const notFound=(req,res)=>res.status(404).json({success:false,message:`Route not found: ${req.method} ${req.originalUrl}`});
export const errorHandler=(err,_req,res,_next)=>{
let status=err.status||500,message=err.message||'Server error',errors=err.errors;
if(err instanceof ZodError){status=400;message='Validation failed';errors=err.issues.map(i=>({field:i.path.join('.'),message:i.message}))}
else if(err.name==='ValidationError'){status=400;message='Validation failed';errors=Object.values(err.errors).map(e=>({field:e.path,message:e.message}))}
else if(err.name==='CastError'){status=400;message=`Invalid ${err.path}`}
else if(err.code===11000){status=409;const f=Object.keys(err.keyPattern||{})[0];message=f==='email'?'Email already registered':'Duplicate entry';errors=f==='email'?[{field:'email',message}]:undefined}
else if(err.name==='JsonWebTokenError'||err.name==='TokenExpiredError'){status=401;message='Invalid or expired token'}
if(status===500){console.error(err);if(env.nodeEnv==='production')message='Internal server error'}
res.status(status).json({success:false,message,...(errors&&{errors})})};
