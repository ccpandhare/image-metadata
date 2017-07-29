module.exports = function SOF0(ffe0) {
  // ffc0 is the array of fragments with 0xFF 0xC0 marker
  var JFIF;
  var metadata = {};
  var densityUnits = ['none; specifes aspect ratio','dots/inch','dots/cm'];

  return new Promise((resolve,reject)=>{

    for(var i in ffe0) { // Validate which one is Main SOF0
      var fragment = ffe0[i];

      // Length of fragment must be >= 16
      if( parseInt(fragment.substr(4,4),16) < 16 )
        continue;

      // Bytes 5 through 9 represent "JFIF" in ASCII
      if( fragment.substr(8,10).toUpperCase() != "4A46494600" )
        continue;

      // Major Revision Number nust be 1
      if( parseInt(fragment.substr(18,2),16) != 1 )
        continue;

      // Else identify JFIF as Valid
      JFIF = fragment;

    }

    if (typeof(JFIF) != 'string') reject('No Valid JFIF Found');

    metadata.densityUnit = densityUnits[ parseInt(JFIF.substr(22,2),16) ];
    metadata.xDensity = parseInt(JFIF.substr(24,4),16);
    metadata.yDensity = parseInt(JFIF.substr(28,4),16);
    metadata.thumbnailWidth = parseInt(JFIF.substr(32,2));
    metadata.thumbnailHeight = parseInt(JFIF.substr(34,2));

    metadata.JFIF = {
      fragments: ffe0,
      length: parseInt(JFIF.substr(4,4),16),
      identifier: JFIF.substr(8,10),
      majorRevision: parseInt(JFIF.substr(18,2),16),
      minorRevision: parseInt(JFIF.substr(20,2),16),
      densityUnit: metadata.densityUnit,
      xDensity: metadata.xDensity,
      yDensity: metadata.yDensity,
      thumbnailWidth: metadata.thumbnailWidth,
      thumbnailHeight: metadata.thumbnailHeight,
    }

    resolve(metadata);
  });

}
