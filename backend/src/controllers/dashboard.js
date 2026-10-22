import {Application} from '../models/Application.js';import {Job} from '../models/Job.js';import {Notification} from '../models/Notification.js';import {asyncHandler,ok} from '../utils/ApiError.js';
const tally=rows=>{const t={total:0,pending:0,accepted:0,rejected:0};rows.forEach(r=>{t.total+=r.n;t[r._id.toLowerCase()]=r.n});return t};
export const worker=asyncHandler(async(req,res)=>{const u=req.user;
const [rows,recent,unread,applied]=await Promise.all([Application.aggregate([{$match:{worker:u._id}},{$group:{_id:'$status',n:{$sum:1}}}]),Application.find({worker:u._id}).populate('job','title category location salary status').sort({createdAt:-1}).limit(5),Notification.countDocuments({user:u._id,read:false}),Application.distinct('job',{worker:u._id})]);
const fields=[u.phone,u.city,u.skills.length,u.about,u.experience>0,u.expectedWage];
const recommended=await Job.find({status:'open',_id:{$nin:applied}}).populate('recruiter','name company').sort({createdAt:-1}).limit(3);
ok(res,{applications:tally(rows),profileCompleteness:Math.round(fields.filter(Boolean).length/fields.length*100),unreadNotifications:unread,recentApplications:recent,recommendedJobs:recommended})});
export const recruiter=asyncHandler(async(req,res)=>{const id=req.user._id;
const [jobs,rows,recent,perf,unread]=await Promise.all([Job.aggregate([{$match:{recruiter:id}},{$group:{_id:'$status',n:{$sum:1}}}]),Application.aggregate([{$match:{recruiter:id}},{$group:{_id:'$status',n:{$sum:1}}}]),
Application.find({recruiter:id}).populate('worker','name city skills').populate('job','title').sort({createdAt:-1}).limit(5),
Application.aggregate([{$match:{recruiter:id}},{$group:{_id:'$job',applicants:{$sum:1},accepted:{$sum:{$cond:[{$eq:['$status','Accepted']},1,0]}}}}]),Notification.countDocuments({user:id,read:false})]);
const myJobs=await Job.find({recruiter:id}).select('title openings status');const pm=Object.fromEntries(perf.map(p=>[p._id,p]));
const j={total:0,open:0,closed:0};jobs.forEach(r=>{j.total+=r.n;j[r._id]=r.n});
ok(res,{jobs:j,applicants:tally(rows),unreadNotifications:unread,recentApplicants:recent,jobPerformance:myJobs.map(x=>({jobId:x.id,title:x.title,status:x.status,openings:x.openings,applicants:pm[x.id]?.applicants||0,accepted:pm[x.id]?.accepted||0}))})});
