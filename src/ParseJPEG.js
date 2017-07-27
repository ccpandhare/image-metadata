var componentID = ['Y','Cb','Cr','I','Q']

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
    var SOF0 = fragments.ffc0[0];
    metadata.height = parseInt(SOF0.substr(10,4),16);
    metadata.width = parseInt(SOF0.substr(14,4),16);
    metadata.components = {
      number: parseInt(SOF0.substr(18,2),16),
      colorspace: ""
    };
    for (var i = 1; i <= metadata.components.number; i++) {
      var component = SOF0.substr(20+6*(i-1),6);
      metadata.components['component'+i] = {
        ID: parseInt(component.substr(0,2),16),
        name: componentID[parseInt(component.substr(0,2),16) - 1],
        samplingFactorVertical: parseInt(component.substr(2,1),16),
        samplingFactorHorizontal: parseInt(component.substr(3,1),16),
        quantizationTableNumber: parseInt(component.substr(4,2),16)
      }
      metadata.components.colorspace += metadata.components['component'+i].name;
    }
  }

  /**** APP0 :: 0xFFE0 Marker Fragment ****/
  metadata.JFIF
  if (fragments.hasOwnProperty('ffc0')) {
    var APP0 = fragments.ffe0[0];
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
