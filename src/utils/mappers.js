// Translate API documents <-> the shapes the existing UI already uses.
const id=o=>o&&(o.id||o._id||o);const ts=d=>new Date(d).getTime();
export const toJob=j=>({id:j.id,recruiterId:id(j.recruiter),company:j.recruiter?.company||j.recruiter?.name||'',title:j.title,category:j.category,city:j.location,type:j.jobType,wage:j.salary,openings:j.openings,description:j.description,skills:j.requirements||[],status:j.status,postedAt:ts(j.createdAt)});
export const toApp=a=>({id:a.id,jobId:id(a.job),workerId:id(a.worker),status:a.status,message:a.message,at:ts(a.createdAt)});
export const toNote=n=>({id:n.id,userId:n.user,text:n.text,read:n.read,at:ts(n.createdAt)});
export const toUser=u=>({id:u.id,role:u.role,name:u.name,email:u.email,phone:u.phone,city:u.city,about:u.about||'',company:u.company,skills:u.skills||[],experience:u.experience??0,availability:u.availability,wage:u.expectedWage});
export const fromJobForm=j=>({title:j.title,category:j.category,location:j.city,jobType:j.type,salary:j.wage,openings:j.openings,description:j.description,requirements:j.skills});
export const fromProfile=p=>{const o={...p};if('wage' in o){o.expectedWage=o.wage;delete o.wage}return o};
