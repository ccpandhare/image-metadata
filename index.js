var src = process.argv[2] || "testimages/red.jpg";
imageMetadata = require('./src/ImageMetadata.js')(src);
data = false;
imageMetadata.then(o=>{
  data=o;
  console.log(data);
}).catch(err=>{
  console.error(err);
});
