const BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
const TOKEN_KEY='hiresphere_token'; // localStorage is used ONLY for the login session token
export const tokenStore={get:()=>{try{return localStorage.getItem(TOKEN_KEY)}catch{return null}},set:t=>localStorage.setItem(TOKEN_KEY,t),clear:()=>localStorage.removeItem(TOKEN_KEY)};
async function request(method,path,body){
let res;try{res=await fetch(BASE+path,{method,headers:{'Content-Type':'application/json',...(tokenStore.get()&&{Authorization:`Bearer ${tokenStore.get()}`})},body:body?JSON.stringify(body):undefined})}
catch{const e=new Error('Cannot reach the server. Please check that the backend is running.');e.status=0;throw e}
let json=null;try{json=await res.json()}catch{}
if(!res.ok||json?.success===false){const e=new Error(json?.message||`Request failed (${res.status})`);e.status=res.status;
if(json?.errors)e.fields=Object.fromEntries(json.errors.map(x=>[x.field,x.message]));throw e}
return json}
export const api={get:p=>request('GET',p),post:(p,b)=>request('POST',p,b),put:(p,b)=>request('PUT',p,b),patch:(p,b)=>request('PATCH',p,b),del:p=>request('DELETE',p)};
