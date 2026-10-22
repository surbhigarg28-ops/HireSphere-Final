export default {content:['./index.html','./src/**/*.{js,jsx}'],theme:{extend:{colors:{navy:{DEFAULT:'#0B1F3A',700:'#12315A',800:'#0A1A30'},teal:{DEFAULT:'#0E9F9A',50:'#E6F7F6',100:'#C5EEEC',600:'#0A7F7B'}},fontFamily:{sans:['Inter','system-ui','sans-serif']},
boxShadow:{soft:'0 1px 2px rgba(11,31,58,.04),0 8px 24px -8px rgba(11,31,58,.10)',lift:'0 12px 32px -8px rgba(11,31,58,.18)'},
keyframes:{fadeUp:{'0%':{opacity:0,transform:'translateY(12px)'},'100%':{opacity:1,transform:'none'}},float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-8px)'}},pop:{'0%':{opacity:0,transform:'scale(.96)'},'100%':{opacity:1,transform:'none'}}},
animation:{'fade-up':'fadeUp .5s ease both',float:'float 5s ease-in-out infinite',pop:'pop .18s ease both'}}},plugins:[]};
