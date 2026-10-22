import {createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {api,tokenStore} from './api';import {toJob,toApp,toNote,toUser,fromJobForm,fromProfile} from './mappers';
import {Spinner} from '../components/ui';
const Ctx=createContext();export const useStore=()=>useContext(Ctx);
const EMPTY={users:[],jobs:[],applications:[],notes:[]};
export function StoreProvider({children}){
const [s,setS]=useState(EMPTY);const [user,setUser]=useState(null);const [ready,setReady]=useState(false);const [toast,setToast]=useState(null);const timer=useRef();const userRef=useRef(null);
const notify=(m,t='success')=>{setToast({m,t});clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(null),2800)};
// Pull everything the current role needs from the API (public jobs when logged out)
const load=useCallback(async u=>{
const jobs=(await api.get('/jobs?limit=200')).data.map(toJob);
if(!u)return setS({...EMPTY,jobs});
const [n,a]=await Promise.all([api.get('/notifications'),api.get(u.role==='worker'?'/applications/mine':'/applications/recruiter')]);
const workers=u.role==='recruiter'?[...new Map(a.data.filter(x=>x.worker?.id).map(x=>[x.worker.id,toUser(x.worker)])).values()]:[];
setS({users:[u,...workers],jobs,applications:a.data.map(toApp),notes:n.data.map(toNote)})},[]);
const refresh=useCallback(()=>load(userRef.current),[load]);
const setSession=u=>{userRef.current=u;setUser(u)};
const logoutLocal=()=>{tokenStore.clear();setSession(null);load(null).catch(()=>{})};
// Restore session on first load
useEffect(()=>{(async()=>{try{let u=null;if(tokenStore.get()){try{u=toUser((await api.get('/auth/me')).data)}catch(e){if(e.status===401)tokenStore.clear();else throw e}}setSession(u);await load(u)}catch(e){notify(e.message,'error')}finally{setReady(true)}})()},[load]);
// Keep both dashboards in sync: poll + refresh when the tab regains focus
useEffect(()=>{if(!user)return;const go=()=>refresh().catch(e=>e.status===401&&(logoutLocal(),notify('Session expired. Please log in again.','error')));const t=setInterval(go,20000);window.addEventListener('focus',go);return()=>{clearInterval(t);window.removeEventListener('focus',go)}},[user?.id]);
// Every action resolves to {ok,data,error,fields}; failures show an error toast unless silent (forms show inline errors)
const run=async(fn,silent)=>{try{const data=await fn();return{ok:true,data}}catch(e){if(e.status===401&&userRef.current){logoutLocal();notify('Session expired. Please log in again.','error')}else if(!silent)notify(e.message,'error');return{ok:false,error:e.message,fields:e.fields}}};
const sync=async fn=>{const r=await run(fn);if(r.ok)await refresh().catch(()=>{});return r};
const auth=async(path,body)=>run(async()=>{const r=await api.post(path,body);tokenStore.set(r.data.token);const u=toUser(r.data.user);setSession(u);await load(u);return u},true);
const api2={s,user,toast,notify,
login:(email,pw)=>auth('/auth/login',{email,password:pw}),
signup:f=>auth('/auth/register',{role:f.role,name:f.name,email:f.email,phone:f.phone,city:f.city,password:f.password,...(f.role==='recruiter'&&{company:f.company})}),
logout:logoutLocal,
updateUser:async p=>{const r=await run(async()=>{const d=(await api.put(user.role==='worker'?'/workers/profile':'/recruiters/profile',fromProfile(p))).data;const u=toUser(d);setSession(u);setS(x=>({...x,users:x.users.map(o=>o.id===u.id?u:o)}));return u});return r},
postJob:j=>sync(async()=>(await api.post('/jobs',fromJobForm(j))).data),
updateJob:(jid,p)=>sync(()=>Object.keys(p).join()==='status'?api.patch(`/jobs/${jid}/status`,p):api.put(`/jobs/${jid}`,fromJobForm(p))),
deleteJob:jid=>sync(()=>api.del(`/jobs/${jid}`)),
apply:(jobId,message)=>sync(()=>api.post('/applications',{jobId,message})),
withdraw:aid=>sync(()=>api.del(`/applications/${aid}`)),
setStatus:(aid,status)=>sync(()=>api.patch(`/applications/${aid}/status`,{status})),
markRead:()=>sync(()=>api.patch('/notifications/read-all'))};
if(!ready)return <div className="min-h-screen grid place-items-center"><Spinner/></div>;
return <Ctx.Provider value={api2}>{children}</Ctx.Provider>}
