import {z} from 'zod';import {User} from '../models/User.js';import {signToken} from '../middleware/auth.js';import {ApiError,asyncHandler,ok} from '../utils/ApiError.js';
const phone=z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile number');
export const registerSchema=z.object({role:z.enum(['worker','recruiter']),name:z.string().trim().min(2,'Enter your full name').max(80),email:z.string().trim().toLowerCase().email('Enter a valid email'),phone,city:z.string().trim().min(1,'City is required').max(60),password:z.string().min(6,'Minimum 6 characters').max(72),company:z.string().trim().max(120).optional()})
.refine(d=>d.role!=='recruiter'||d.company,{path:['company'],message:'Company name is required'});
export const loginSchema=z.object({email:z.string().trim().toLowerCase().email(),password:z.string().min(1)});
export const register=asyncHandler(async(req,res)=>{const {role,company,...rest}=req.body;
if(await User.exists({email:rest.email}))throw new ApiError(409,'Email already registered',[{field:'email',message:'Email already registered'}]);
const user=await User.create({...rest,role,...(role==='recruiter'&&{company})});ok(res,{token:signToken(user),user},{message:'Account created'},201)});
export const login=asyncHandler(async(req,res)=>{const user=await User.findOne({email:req.body.email}).select('+password');
if(!user||!(await user.comparePassword(req.body.password)))throw new ApiError(401,'Invalid email or password');ok(res,{token:signToken(user),user})});
export const me=asyncHandler(async(req,res)=>ok(res,req.user));
