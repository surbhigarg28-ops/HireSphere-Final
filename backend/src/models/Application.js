import mongoose from 'mongoose';const R=mongoose.Schema.Types.ObjectId;
const schema=new mongoose.Schema({job:{type:R,ref:'Job',required:true},worker:{type:R,ref:'User',required:true,index:true},recruiter:{type:R,ref:'User',required:true,index:true},
status:{type:String,enum:['Pending','Accepted','Rejected'],default:'Pending'},message:{type:String,trim:true,maxlength:500,default:''}},{timestamps:true});
schema.index({job:1,worker:1},{unique:true}); // one application per worker per job
schema.set('toJSON',{transform:(_,r)=>{r.id=r._id.toString();delete r._id;delete r.__v;return r}});
export const Application=mongoose.model('Application',schema);
