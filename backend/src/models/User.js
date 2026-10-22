import mongoose from 'mongoose';import bcrypt from 'bcryptjs';
const schema=new mongoose.Schema({
role:{type:String,enum:['worker','recruiter'],required:true},
name:{type:String,required:true,trim:true,minlength:2,maxlength:80},
email:{type:String,required:true,unique:true,lowercase:true,trim:true},
password:{type:String,required:true,minlength:6,select:false},
phone:{type:String,trim:true},city:{type:String,trim:true},about:{type:String,maxlength:1000,default:''},
skills:{type:[String],default:[]},experience:{type:Number,min:0,max:60,default:0},
availability:{type:String,enum:['Immediately','Within a week','Within a month'],default:'Immediately'},expectedWage:{type:Number,min:100,default:500},
company:{type:String,trim:true,maxlength:120}},{timestamps:true});
schema.pre('save',async function(next){if(this.isModified('password'))this.password=await bcrypt.hash(this.password,12);next()});
schema.methods.comparePassword=function(p){return bcrypt.compare(p,this.password)};
schema.set('toJSON',{transform:(_,r)=>{r.id=r._id.toString();delete r._id;delete r.__v;delete r.password;return r}});
export const User=mongoose.model('User',schema);
