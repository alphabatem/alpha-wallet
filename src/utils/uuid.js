export function uuidV4() {
  function generateNumber(limit) {
    const value = limit * Math.random();
    return value | 0;
  }
  function generateX() {
    const value = generateNumber(16);
    return value.toString(16);
  }
  function generateXes(count) {
    var result = '';
    for(let i = 0; i < count; ++i) {
      result += generateX();
    }
    return result;
  }
  function generateVariant() {
    const value = generateNumber(16);
    const variant =  (value & 0x3) | 0x8;
    return variant.toString(16);
  }
  // UUID v4
  //
  //   varsion: M=4
  //   variant: N
  //   pattern: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
  //
  this.generate = function() {
    const result = generateXes(8)
      + '-' + generateXes(4)
      + '-' + '4' + generateXes(3)
      + '-' + generateVariant() + generateXes(3)
      + '-' + generateXes(12)
    return result;
  };
}
