"file 1";"file3";const fs=require("fs");try{fs.unlinkSync("/tmp/hello"),console.log("successfully deleted /tmp/hello")}catch(e){}function bad(){require("fs").readFile("/")}fs.rename("/tmp/hello","/tmp/world",e=>{if(e)throw e;console.log("renamed complete")}),fs.stat("/tmp/world",(e,l)=>{if(e)throw e;console.log(`stats: ${JSON.stringify(l)}`)}),fs.rename("/tmp/hello","/tmp/world",e=>{if(e)throw e;fs.stat("/tmp/world",(e,l)=>{if(e)throw e;console.log(`stats: ${JSON.stringify(l)}`)})}),bad(),fs.open("/open/some/file.txt","r",(e,l)=>{if(e)throw e;fs.close(l,e=>{if(e)throw e})}),fs.open("file.txt","r",(e,l)=>{if(e)throw e;fs.close(l,e=>{if(e)throw e})}),fs.open(Buffer.from("/open/some/file.txt"),"r",(e,l)=>{if(e)throw e;fs.close(l,e=>{if(e)throw e})});const{URL:URL}=require("url"),fileUrl=new URL("file:///tmp/hello");fs.readFileSync(fileUrl),fs.readFileSync(new URL("file://hostname/p/a/t/h/file")),fs.readFileSync(new URL("file:///C:/tmp/hello")),fs.readFileSync(new URL("file:///notdriveletter/p/a/t/h/file")),fs.readFileSync(new URL("file:///c/p/a/t/h/file")),fs.readFileSync(new URL("file://hostname/p/a/t/h/file")),fs.readFileSync(new URL("file:///tmp/hello")),fs.open("/open/some/file.txt","r",(e,l)=>{if(e)throw e;fs.fstat(l,(e,f)=>{if(e)throw e;fs.close(l,e=>{if(e)throw e})})}),fs.watch("./tmp",{encoding:"buffer"},(e,l)=>{l&&console.log(l)});