import { mkdir, copyFile, rm } from 'node:fs/promises';
for (const dest of ['dist','android/app/src/main/assets']) {
  await rm(dest,{recursive:true,force:true});
  await mkdir(dest,{recursive:true});
  await copyFile('index.html',dest+'/index.html');
}
console.log('Built unified 16-game HTML for static hosting and offline Android WebView.');
