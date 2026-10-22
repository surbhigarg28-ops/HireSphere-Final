import jwt from 'jsonwebtoken';import {env} from '../config/env.js';import {User} from '../models/User.js';import {ApiError,asyncHandler} from '../utils/ApiError.js';
export const signToken=u=>jwt.sign({id:u.id,role:u.role},env.jwtSecret,{expiresIn:env.jwtExpires});
export const protect=asyncHandler(async(req,_res,next)=>{
const h=req.headers.authorization||'';if(!h.startsWith('Bearer '))throw new ApiError(401,'Authentication required');
const {id}=jwt.verify(h.slice(7),env.jwtSecret);const user=await User.findById(id);if(!user)throw new ApiError(401,'Account no longer exists');req.user=user;next()});
export const authorize=(...roles)=>(req,_res,next)=>roles.includes(req.user.role)?next():next(new ApiError(403,`Only ${roles.join('/')} accounts can do this`));
