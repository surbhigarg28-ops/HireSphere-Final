const d=n=>Date.now()-n*864e5;
export const CATEGORIES=['Construction','Electrician','Plumbing','Driving','Painting','Carpentry','Housekeeping','Warehouse','Security','Agriculture'];
export const CITIES=['Ludhiana','Chandigarh','Delhi','Jaipur','Pune','Mumbai','Bengaluru'];
export const TYPES=['Full-time','Part-time','Daily wage','Contract'];
const J=(id,title,category,city,type,wage,openings,days,description,skills)=>({id,recruiterId:'r1',title,category,company:'BuildRight Infra',city,type,wage,openings,description,skills,status:'open',postedAt:d(days)});
export const seed={session:null,
users:[
{id:'w1',role:'worker',name:'Ravi Kumar',email:'worker@demo.com',password:'Demo@123',phone:'9876543210',city:'Ludhiana',skills:['Masonry','Tiling','Plastering'],experience:6,availability:'Immediately',wage:700,about:'Hardworking mason with 6 years on residential and commercial sites. Punctual and safety-conscious.'},
{id:'w2',role:'worker',name:'Sunil Yadav',email:'sunil@demo.com',password:'Demo@123',phone:'9812345678',city:'Chandigarh',skills:['Wiring','Panel Fitting'],experience:4,availability:'Within a week',wage:850,about:'Helper electrician comfortable with site wiring and fittings.'},
{id:'w3',role:'worker',name:'Imran Sheikh',email:'imran@demo.com',password:'Demo@123',phone:'9898989898',city:'Delhi',skills:['Heavy Vehicle','Loading'],experience:9,availability:'Immediately',wage:1000,about:'Truck driver with 9 years of highway experience, clean record.'},
{id:'r1',role:'recruiter',name:'Anita Sharma',email:'recruiter@demo.com',password:'Demo@123',phone:'9700011122',city:'Ludhiana',company:'BuildRight Infra Pvt Ltd',about:'We build residential towers across North India and hire skilled labour all year round.'}],
jobs:[
J('j1','Mason / Bricklayer','Construction','Ludhiana','Daily wage',750,12,1,'Brick and block work for a 14-storey residential tower. Site timings 8am–5pm, lunch and safety gear provided.',['Masonry','Plastering']),
J('j2','Site Electrician','Electrician','Chandigarh','Full-time',900,4,2,'Conduit, wiring and DB fitting for new commercial floors. Prior site experience required.',['Wiring','Panel Fitting']),
J('j3','Heavy Truck Driver','Driving','Delhi','Contract',1100,6,3,'Material transport between Delhi NCR and Punjab. Valid HMV licence required, fuel and tolls covered.',['Heavy Vehicle']),
J('j4','House Painter','Painting','Jaipur','Daily wage',650,10,4,'Interior and exterior painting for apartment finishing. Own brushes preferred.',['Painting','Putty']),
J('j5','Plumber','Plumbing','Pune','Full-time',800,3,5,'CPVC and PVC plumbing for new apartments, bathroom fittings and leak testing.',['Pipe Fitting']),
J('j6','Warehouse Loader','Warehouse','Mumbai','Part-time',550,20,6,'Loading and unloading at a logistics hub. Evening shift 4pm–10pm.',['Loading']),
J('j7','Carpenter','Carpentry','Bengaluru','Contract',950,5,7,'Modular wardrobes, door frames and shuttering work for a 3-month project.',['Carpentry','Shuttering']),
J('j8','Security Guard','Security','Ludhiana','Full-time',600,8,8,'Gate and perimeter security for a gated township. 12-hour rotating shifts.',['Patrolling'])],
applications:[
{id:'a1',jobId:'j1',workerId:'w1',status:'Accepted',message:'I have 6 years of masonry experience and can join tomorrow.',at:d(1)},
{id:'a2',jobId:'j4',workerId:'w1',status:'Pending',message:'Available for painting work immediately.',at:d(2)},
{id:'a3',jobId:'j2',workerId:'w2',status:'Pending',message:'Experienced in commercial wiring.',at:d(1)},
{id:'a4',jobId:'j3',workerId:'w3',status:'Rejected',message:'9 years of driving experience.',at:d(2)},
{id:'a5',jobId:'j1',workerId:'w3',status:'Pending',message:'Can also help with material handling.',at:d(1)}],
notes:[
{id:'n1',userId:'w1',text:'Your application for Mason / Bricklayer was Accepted.',read:false,at:d(1)},
{id:'n2',userId:'r1',text:'Sunil Yadav applied for Site Electrician.',read:false,at:d(1)},
{id:'n3',userId:'r1',text:'Imran Sheikh applied for Mason / Bricklayer.',read:false,at:d(1)}]};
