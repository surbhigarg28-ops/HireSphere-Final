export class ApiError extends Error{constructor(status,message,errors){super(message);this.status=status;this.errors=errors}}
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const ok=(res,data,extra={},status=200)=>res.status(status).json({success:true,data,...extra});
