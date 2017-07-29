module.exports = function SOF0(ffc0) {
  // ffc0 is the array of fragments with 0xFF 0xC0 marker
  var SOF0;
  var width;
  var metadata = {};
  var componentID = ['Y','Cb','Cr','I','Q'];

  return new Promise((resolve,reject)=>{

    for(var i in ffc0) { // Validate which one is Main SOF0
      var fragment = ffc0[i];

      // Length of fragment must be according to what is defined in the length bytes
      if( fragment.length != 2*(parseInt(fragment.substr(4,4),16)+2) )
        continue;

      // Length of fragment must be according to JPEG specifications
      if(fragment.length != 2*(10 + 3*parseInt(fragment.substr(18,2),16)) )
        continue;

      // Now take the fragment denoting higher dimensions.
      {
        width = width || 0;
        if( parseInt(fragment.substr(14,4),16) > width )
          SOF0 = fragment;
        else
          continue;
      }
    }

    if (typeof(SOF0) != 'string') reject('No Valid SOF0 Found');

    metadata.height = parseInt(SOF0.substr(10,4),16);
    metadata.width = parseInt(SOF0.substr(14,4),16);

    // Get the color component information
    var components = {
      number: parseInt(SOF0.substr(18,2),16),
      colorspace: ""
    };
    for (var i = 1; i <= components.number; i++) {
      var component = SOF0.substr(20+6*(i-1),6);
      components['component'+i] = {
        ID: parseInt(component.substr(0,2),16),
        name: componentID[parseInt(component.substr(0,2),16) - 1],
        samplingFactorVertical: parseInt(component.substr(2,1),16),
        samplingFactorHorizontal: parseInt(component.substr(3,1),16),
        quantizationTableNumber: parseInt(component.substr(4,2),16)
      }
      components.colorspace += components['component'+i].name;
    }

    metadata.SOF0 = {
      fragments: ffc0,
      length: parseInt(SOF0.substr(4,4),16),
      dataPrecision: parseInt(SOF0.substr(14,2),16),
      width: metadata.width,
      height: metadata.height,
      components: components
    }
    metadata.colorspace = components.colorspace;

    resolve(metadata);
  });

}
