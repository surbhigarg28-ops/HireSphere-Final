import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},type:{type:String,enum:['application','status','system'],default:'system'},text:{type:String,required:true,maxlength:300},link:String,read:{type:Boolean,default:false}},{timestamps:true});
schema.set('toJSON',{transform:(_,r)=>{r.id=r._id.toString();delete r._id;delete r.__v;return r}});
export const Notification=mongoose.model('Notification',schema);
