var getHex = require('./GetHex');
var getType = require('./GetType');
var parseJPEG = require('./JPEG/ParseJPEG');

module.exports = function ImageMetadata(file) {

  return new Promise( (resolve,reject) => {
    getHex(file)
      .then((hex)=>{
        var output = {};
        output.type = getType(hex.substring(0,8));
        parseJPEG(hex)
          .then((metadata)=>{
            Object.assign(output,metadata);
            resolve(output);
          });
      })
      .catch((err)=>{
        var error = "Invalid File Reference";
        reject(error);
      });
  });

}
