export const isEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v||'');
export const isPhone=v=>/^[6-9]\d{9}$/.test(v||'');
export const ago=t=>{const m=Math.floor((Date.now()-t)/60000);if(m<1)return'just now';if(m<60)return m+'m ago';const h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago'};
export const money=n=>'₹'+Number(n).toLocaleString('en-IN');
