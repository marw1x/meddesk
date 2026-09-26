const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','dist');
const T={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain'};
http.createServer((q,s)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u.endsWith('/'))u+='index.html';
const f=path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end('404 '+u);}
s.writeHead(200,{'Content-Type':T[path.extname(f).toLowerCase()]||'application/octet-stream'});s.end(d);});
}).listen(4830,()=>console.log('http://localhost:4830'));
