import {z} from 'zod';import {Job,CATEGORIES,JOB_TYPES} from '../models/Job.js';import {Application} from '../models/Application.js';import {ApiError,asyncHandler,ok} from '../utils/ApiError.js';
const POP={path:'recruiter',select:'name company city'};const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const jobSchema=z.object({title:z.string().trim().min(3,'Enter a job title').max(120),description:z.string().trim().min(20,'Describe the job (20+ characters)').max(3000),category:z.enum(CATEGORIES),location:z.string().trim().min(1).max(60),salary:z.coerce.number().min(100,'Minimum ₹100/day'),jobType:z.enum(JOB_TYPES),requirements:z.array(z.string().trim().min(1).max(60)).max(20).default([]),openings:z.coerce.number().int().min(1,'At least 1 opening').max(1000)});
export const statusSchema=z.object({status:z.enum(['open','closed'])});
export const querySchema=z.object({q:z.string().trim().max(80).optional(),category:z.enum(CATEGORIES).optional(),location:z.string().trim().optional(),jobType:z.enum(JOB_TYPES).optional(),status:z.enum(['open','closed']).optional(),minSalary:z.coerce.number().optional(),sort:z.enum(['newest','salary']).default('newest'),page:z.coerce.number().int().min(1).default(1),limit:z.coerce.number().int().min(1).max(200).default(50)});
export const list=asyncHandler(async(req,res)=>{const {q,category,location,jobType,status,minSalary,sort,page,limit}=req.query;const f={};
if(category)f.category=category;if(location)f.location=new RegExp(`^${esc(location)}$`,'i');if(jobType)f.jobType=jobType;if(status)f.status=status;if(minSalary)f.salary={$gte:minSalary};
if(q){const re=new RegExp(esc(q),'i');f.$or=[{title:re},{description:re},{category:re},{requirements:re}]}
const [data,total]=await Promise.all([Job.find(f).populate(POP).sort(sort==='salary'?{salary:-1}:{createdAt:-1}).skip((page-1)*limit).limit(limit),Job.countDocuments(f)]);
ok(res,data,{meta:{page,limit,total,pages:Math.ceil(total/limit)}})});
export const getOne=asyncHandler(async(req,res)=>{const j=await Job.findById(req.params.id).populate(POP);if(!j)throw new ApiError(404,'Job not found');ok(res,j)});
export const mine=asyncHandler(async(req,res)=>{const jobs=await Job.find({recruiter:req.user.id}).populate(POP).sort({createdAt:-1});
const counts=await Application.aggregate([{$match:{recruiter:req.user._id}},{$group:{_id:'$job',n:{$sum:1}}}]);const m=Object.fromEntries(counts.map(c=>[c._id,c.n]));
ok(res,jobs.map(j=>({...j.toJSON(),applicantCount:m[j.id]||0})))});
const owned=async(req)=>{const j=await Job.findById(req.params.id);if(!j)throw new ApiError(404,'Job not found');if(j.recruiter.toString()!==req.user.id)throw new ApiError(403,'You can only manage your own jobs');return j};
export const create=asyncHandler(async(req,res)=>{const j=await Job.create({...req.body,recruiter:req.user.id});ok(res,await j.populate(POP),{message:'Job posted'},201)});
export const update=asyncHandler(async(req,res)=>{const j=await owned(req);Object.assign(j,req.body);await j.save();ok(res,await j.populate(POP),{message:'Job updated'})});
export const setStatus=asyncHandler(async(req,res)=>{const j=await owned(req);j.status=req.body.status;await j.save();ok(res,await j.populate(POP),{message:`Job ${j.status==='open'?'reopened':'closed'}`})});
export const remove=asyncHandler(async(req,res)=>{const j=await owned(req);await Application.deleteMany({job:j.id});await j.deleteOne();ok(res,{id:j.id},{message:'Job deleted'})});
