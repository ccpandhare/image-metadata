function makeFragments(hex,callback) {
  var fragments = {};
  var fragment;
  function add(fragment) {
    marker = fragment.substring(0,4);
    if (fragments.hasOwnProperty(marker))
      fragments[marker].push(fragment);
    else fragments[marker] = [fragment];
  }
  for (var i = 0; i < hex.length; i += 2) {
    var byte = hex.charAt(i) + hex.charAt(i+1);
    if (byte.toUpperCase() == "FF") {
      if(!!fragment) add(fragment);
      fragment = byte;
    }
    else {
      fragment += byte;
    }
    if (i == hex.length - 2) {
      add(fragment);
    }
  }
  callback(fragments);
}

function analyseFragments(fragments,callback) {
  var metadata = {};

  /**** SOF0 :: 0xFFC0 Marker Fragment ****/
  if (fragments.hasOwnProperty('ffc0')) {
    require('./SOF0')(fragments.ffc0)
      .then(obj=>{
        Object.assign(metadata,obj)
      })
      .catch(err=>{
        console.error(err);
      });
  }

  /**** APP0 :: 0xFFE0 Marker Fragment ****/
  if (fragments.hasOwnProperty('ffe0')) {
    require('./JFIF')(fragments.ffe0)
      .then(obj=>{
        Object.assign(metadata,obj)
      })
      .catch(err=>{
        console.error(err);
      });
  }

  /**** APP1(Exif) :: 0xFFE1 Marker Fragment ****/
  if (fragments.hasOwnProperty('ffe1')) {
    require('./EXIF')(fragments.ffe1)
      .then(obj=>{
        Object.assign(metadata,obj)
      })
      .catch(err=>{
        console.error(err);
      });
  }

  callback(metadata)
}

module.exports = function ParseJPEG(hex) {
  return new Promise((resolve,reject)=>{
    makeFragments(hex,function(fragments){
      analyseFragments(fragments,function(metadata){
        resolve(metadata);
      });
    });
  });
}
