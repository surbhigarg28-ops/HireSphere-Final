import {z} from 'zod';import mongoose from 'mongoose';import {Job} from '../models/Job.js';import {Application} from '../models/Application.js';import {ApiError,asyncHandler,ok} from '../utils/ApiError.js';import {notifyUser} from '../utils/notify.js';
const WORKER_FIELDS='name email phone city skills experience availability expectedWage about role';
export const applySchema=z.object({jobId:z.string().refine(v=>mongoose.isValidObjectId(v),'Invalid jobId'),message:z.string().trim().max(500).default('')});
export const statusSchema=z.object({status:z.enum(['Accepted','Rejected'])});
export const apply=asyncHandler(async(req,res)=>{const job=await Job.findById(req.body.jobId);if(!job)throw new ApiError(404,'Job not found');if(job.status!=='open')throw new ApiError(400,'This job is closed');
if(await Application.exists({job:job.id,worker:req.user.id}))throw new ApiError(409,'You have already applied for this job');
const a=await Application.create({job:job.id,worker:req.user.id,recruiter:job.recruiter,message:req.body.message});
await notifyUser(job.recruiter,'application',`${req.user.name} applied for ${job.title}.`,`/recruiter/jobs/${job.id}/applicants`);ok(res,a,{message:'Application submitted'},201)});
export const mine=asyncHandler(async(req,res)=>ok(res,await Application.find({worker:req.user.id}).populate('job','title category location salary jobType status').sort({createdAt:-1})));
export const forRecruiter=asyncHandler(async(req,res)=>{const f={recruiter:req.user.id};if(req.query.jobId){if(!mongoose.isValidObjectId(req.query.jobId))throw new ApiError(400,'Invalid jobId');f.job=req.query.jobId}
ok(res,await Application.find(f).populate('worker',WORKER_FIELDS).sort({createdAt:-1}))});
export const getOne=asyncHandler(async(req,res)=>{const a=await Application.findById(req.params.id).populate('worker',WORKER_FIELDS).populate('job','title category location salary jobType status');if(!a)throw new ApiError(404,'Application not found');
const uid=req.user.id,wid=(a.worker.id||a.worker).toString();if(uid!==wid&&uid!==a.recruiter.toString())throw new ApiError(403,'Not allowed');ok(res,a)});
export const setStatus=asyncHandler(async(req,res)=>{const a=await Application.findById(req.params.id).populate('job','title');if(!a)throw new ApiError(404,'Application not found');if(a.recruiter.toString()!==req.user.id)throw new ApiError(403,'Not your applicant');
if(a.status===req.body.status)return ok(res,a,{message:`Already ${a.status}`});a.status=req.body.status;await a.save();
await notifyUser(a.worker,'status',`Your application for ${a.job.title} was ${a.status}.`,'/worker/applications');ok(res,a,{message:`Applicant ${a.status.toLowerCase()}`})});
export const withdraw=asyncHandler(async(req,res)=>{const a=await Application.findById(req.params.id);if(!a)throw new ApiError(404,'Application not found');if(a.worker.toString()!==req.user.id)throw new ApiError(403,'Not your application');
if(a.status!=='Pending')throw new ApiError(400,'Only pending applications can be withdrawn');await a.deleteOne();ok(res,{id:a.id},{message:'Application withdrawn'})});
