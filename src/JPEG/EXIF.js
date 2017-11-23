module.exports = function SOF0(ffe1) {
  // ffc0 is the array of fragments with 0xFF 0xC0 marker
  var EXIF;
  var metadata = {};

  return new Promise((resolve,reject)=>{

    for(var i in ffe1) { // Validate which one is Main SOF0
      var fragment = ffe1[i];

      // Bytes 5 through 9 represent "JFIF" in ASCII
      if( fragment.substr(8,12) != "457869660000" )
        continue;

      // Endianness must be II(little endian) or MM (big endian)
      var encoding = fragment.substr(20,4).toLowerCase();
      if( encoding != "4949" && encoding != "4d4d" )
        continue;

      // Signature Byte
      if( fragment.substr(24,4) != "2a00" && fragment.substr(24,4) != "002a" )
        continue;

      // Else identify JFIF as Valid
      EXIF = fragment;

    }

    if (typeof(EXIF) != 'string') reject('No Valid EXIF Found');

    var IDF0_offset = parseInt(fragment.substr(26,4),16);

    // metadata.densityUnit = densityUnits[ parseInt(JFIF.substr(22,2),16) ];
    // metadata.xDensity = parseInt(JFIF.substr(24,4),16);
    // metadata.yDensity = parseInt(JFIF.substr(28,4),16);
    // metadata.thumbnailWidth = parseInt(JFIF.substr(32,2));
    // metadata.thumbnailHeight = parseInt(JFIF.substr(34,2));

    // metadata.EXIF = {
    //   fragments: ffe1,
      // length: parseInt(JFIF.substr(4,4),16),
      // identifier: JFIF.substr(8,10),
      // majorRevision: parseInt(JFIF.substr(18,2),16),
      // minorRevision: parseInt(JFIF.substr(20,2),16),
      // densityUnit: metadata.densityUnit,
      // xDensity: metadata.xDensity,
      // yDensity: metadata.yDensity,
      // thumbnailWidth: metadata.thumbnailWidth,
      // thumbnailHeight: metadata.thumbnailHeight,
    // }

    metadata.EXIF = EXIF;

    resolve(metadata);
  });

}
