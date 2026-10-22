import {Notification} from '../models/Notification.js';import {ApiError,asyncHandler,ok} from '../utils/ApiError.js';
export const list=asyncHandler(async(req,res)=>{const [data,unread]=await Promise.all([Notification.find({user:req.user.id}).sort({createdAt:-1}).limit(50),Notification.countDocuments({user:req.user.id,read:false})]);ok(res,data,{meta:{unread}})});
export const readAll=asyncHandler(async(req,res)=>{await Notification.updateMany({user:req.user.id,read:false},{read:true});ok(res,{updated:true},{message:'All notifications marked as read'})});
export const readOne=asyncHandler(async(req,res)=>{const n=await Notification.findOneAndUpdate({_id:req.params.id,user:req.user.id},{read:true},{new:true});if(!n)throw new ApiError(404,'Notification not found');ok(res,n)});
