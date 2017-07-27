var fs = require('fs');
var http = require('http');
var https = require('https');

module.exports = function GetHex(file) {

  function getData(src,callback) {
    return new Promise((resolve,reject)=>{
      if(!!file.match(/^https?:\/\//)) {
        eval(file.match(/^(https?):\/\//)[1]).get(file,(res)=>{
          let data = '';
          res.setEncoding('hex');
          res.on('data',(chunk)=>{data += chunk;});
          res.on('end',()=>{
            resolve(data);
          });
        });
      }
      else if(!!file.match(/^data:/)) {
        var base64 = file.replace(/^(data:image\/.*base64,)/i,'');
        var buffer = Buffer.from(base64, 'base64');
        resolve(buffer.toString('hex'));
      }
      else {
        require('fs').readFile(file,(err,data)=>{
          if(err) reject("ERR");
          else resolve(data.toString('hex'));
        });
      }
    });
  }

  return new Promise((resolve,reject) => {
    var data = getData(file);
    data.then((x)=>{ resolve(x); })
        .catch((err)=>{ reject(err); });
  });

}
