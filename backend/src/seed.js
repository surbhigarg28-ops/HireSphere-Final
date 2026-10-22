import mongoose from 'mongoose';import {env} from './config/env.js';import {User} from './models/User.js';import {Job} from './models/Job.js';import {Application} from './models/Application.js';import {Notification} from './models/Notification.js';
await mongoose.connect(env.mongoUri);
await Promise.all([User,Job,Application,Notification].map(m=>m.deleteMany({})));
const pw='Demo@123';const d=n=>new Date(Date.now()-n*864e5);
const [w1,w2,w3]=await User.create([
{role:'worker',name:'Ravi Kumar',email:'worker@demo.com',password:pw,phone:'9876543210',city:'Ludhiana',skills:['Masonry','Tiling','Plastering'],experience:6,availability:'Immediately',expectedWage:700,about:'Hardworking mason with 6 years on residential and commercial sites.'},
{role:'worker',name:'Sunil Yadav',email:'sunil@demo.com',password:pw,phone:'9812345678',city:'Chandigarh',skills:['Wiring','Panel Fitting'],experience:4,availability:'Within a week',expectedWage:850,about:'Helper electrician comfortable with site wiring.'},
{role:'worker',name:'Imran Sheikh',email:'imran@demo.com',password:pw,phone:'9898989898',city:'Delhi',skills:['Heavy Vehicle','Loading'],experience:9,expectedWage:1000,about:'Truck driver with 9 years of highway experience.'}]);
const r=await User.create({role:'recruiter',name:'Anita Sharma',email:'recruiter@demo.com',password:pw,phone:'9700011122',city:'Ludhiana',company:'BuildRight Infra Pvt Ltd',about:'We build residential towers across North India.'});
const J=(title,category,location,jobType,salary,openings,days,description,requirements)=>({recruiter:r.id,title,category,location,jobType,salary,openings,description,requirements,createdAt:d(days)});
const jobs=await Job.create([
J('Mason / Bricklayer','Construction','Ludhiana','Daily wage',750,12,1,'Brick and block work for a 14-storey residential tower. Lunch and safety gear provided.',['Masonry','Plastering']),
J('Site Electrician','Electrician','Chandigarh','Full-time',900,4,2,'Conduit, wiring and DB fitting for new commercial floors. Prior site experience required.',['Wiring','Panel Fitting']),
J('Heavy Truck Driver','Driving','Delhi','Contract',1100,6,3,'Material transport between Delhi NCR and Punjab. Valid HMV licence required.',['Heavy Vehicle']),
J('House Painter','Painting','Jaipur','Daily wage',650,10,4,'Interior and exterior painting for apartment finishing work.',['Painting','Putty']),
J('Plumber','Plumbing','Pune','Full-time',800,3,5,'CPVC and PVC plumbing for new apartments, fittings and leak testing.',['Pipe Fitting']),
J('Warehouse Loader','Warehouse','Mumbai','Part-time',550,20,6,'Loading and unloading at a logistics hub. Evening shift 4pm–10pm.',['Loading']),
J('Carpenter','Carpentry','Bengaluru','Contract',950,5,7,'Modular wardrobes, door frames and shuttering work for a 3-month project.',['Carpentry','Shuttering']),
J('Security Guard','Security','Ludhiana','Full-time',600,8,8,'Gate and perimeter security for a gated township. 12-hour rotating shifts.',['Patrolling'])]);
const A=(j,w,status,message,days)=>({job:jobs[j].id,worker:w.id,recruiter:r.id,status,message,createdAt:d(days)});
await Application.create([A(0,w1,'Accepted','I have 6 years of masonry experience.',1),A(3,w1,'Pending','Available for painting work immediately.',2),A(1,w2,'Pending','Experienced in commercial wiring.',1),A(2,w3,'Rejected','9 years of driving experience.',2),A(0,w3,'Pending','Can also help with material handling.',1)]);
await Notification.create([{user:w1.id,type:'status',text:'Your application for Mason / Bricklayer was Accepted.'},{user:r.id,type:'application',text:'Sunil Yadav applied for Site Electrician.'},{user:r.id,type:'application',text:'Imran Sheikh applied for Mason / Bricklayer.'}]);
console.log('Seeded. Demo logins (password Demo@123): worker@demo.com, recruiter@demo.com');await mongoose.disconnect();
