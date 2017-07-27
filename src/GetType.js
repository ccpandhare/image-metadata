module.exports = function(initials) {

  if(!!initials.match(/^ffd8/i)) return 'JPEG';
  else if (!!initials.match(/^89504e47/i)) return 'PNG';
  
}
