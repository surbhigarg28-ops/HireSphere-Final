import {z} from 'zod';import {asyncHandler,ok} from '../utils/ApiError.js';
const base={name:z.string().trim().min(2).max(80),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile number'),city:z.string().trim().min(1).max(60),about:z.string().trim().max(1000)};
export const workerSchema=z.object({...base,experience:z.coerce.number().min(0).max(60),expectedWage:z.coerce.number().min(100,'Minimum ₹100'),availability:z.enum(['Immediately','Within a week','Within a month']),skills:z.array(z.string().trim().min(1).max(40)).max(25)}).partial();
export const recruiterSchema=z.object({...base,company:z.string().trim().min(1,'Company is required').max(120)}).partial();
export const getProfile=asyncHandler(async(req,res)=>ok(res,req.user));
export const updateProfile=asyncHandler(async(req,res)=>{Object.assign(req.user,req.body);await req.user.save();ok(res,req.user,{message:'Profile updated'})});
