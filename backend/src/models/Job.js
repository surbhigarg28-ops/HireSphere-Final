import mongoose from 'mongoose';
export const CATEGORIES=['Construction','Electrician','Plumbing','Driving','Painting','Carpentry','Housekeeping','Warehouse','Security','Agriculture'];
export const JOB_TYPES=['Full-time','Part-time','Daily wage','Contract'];
const schema=new mongoose.Schema({
recruiter:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
title:{type:String,required:true,trim:true,minlength:3,maxlength:120},
description:{type:String,required:true,trim:true,minlength:20,maxlength:3000},
category:{type:String,enum:CATEGORIES,required:true,index:true},
location:{type:String,required:true,trim:true,index:true},
salary:{type:Number,required:true,min:100},salaryUnit:{type:String,enum:['day'],default:'day'},
jobType:{type:String,enum:JOB_TYPES,required:true},
requirements:{type:[String],default:[]},openings:{type:Number,required:true,min:1,max:1000},
status:{type:String,enum:['open','closed'],default:'open',index:true}},{timestamps:true});
schema.set('toJSON',{transform:(_,r)=>{r.id=r._id.toString();delete r._id;delete r.__v;return r}});
export const Job=mongoose.model('Job',schema);
