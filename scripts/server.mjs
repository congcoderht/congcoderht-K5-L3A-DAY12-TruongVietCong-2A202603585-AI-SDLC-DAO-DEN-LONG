import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8"};
http.createServer((req,res)=>{let name=decodeURIComponent((req.url||"/").split("?")[0]);if(name==="/")name="/index.html";const file=path.resolve(root,"."+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{if(!statSync(file).isFile())throw new Error();res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"});createReadStream(file).pipe(res);}catch{res.writeHead(404).end("Not found");}}).listen(5173,"127.0.0.1",()=>console.log("Dao Den Long: http://127.0.0.1:5173"));
