import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
const outputs=['dist','android/app/src/main/assets'];
for(const dir of outputs){await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});for(const name of ['index.html','style.css','app.js'])await copyFile(name,`${dir}/${name}`);await cp('assets',`${dir}/assets`,{recursive:true});}
console.log('Built web launcher and bundled Android assets.');
