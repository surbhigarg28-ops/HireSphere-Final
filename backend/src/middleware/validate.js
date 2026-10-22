import mongoose from 'mongoose';import {ApiError} from '../utils/ApiError.js';
export const validate=(schema,src='body')=>(req,_res,next)=>{const r=schema.safeParse(req[src]);if(!r.success)return next(r.error);if(src==='query')Object.defineProperty(req,'query',{value:r.data,writable:true,configurable:true});else req[src]=r.data;next()};
export const validId=(...names)=>(req,_res,next)=>{for(const n of names)if(!mongoose.isValidObjectId(req.params[n]))return next(new ApiError(400,`Invalid ${n}`));next()};
