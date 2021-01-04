export function fromHexStringToIp(rawIp: string, ipFamily: number): string | Error {
  const sliceLength = ipFamily === 1 ? 2 : 4;

  if (ipFamily === 4 && rawIp.length !== 8) {
    throw new Error('Invalid ipV4 Length');
  }
  if (ipFamily === 6 && rawIp.length !== 24) {
    throw new Error('Invalid ipV6 Length');
  }

  const ip = sliceArrayToBatch(rawIp.split(''), sliceLength).map((s: string[]) => fromHexStringToNumber(s.join('')));

  return ip.join('.');
}

function sliceArrayToBatch(arr: string[], sliceLength: number): string[][] {
  const newArr: string[][] = [];
  for (let i = 0; i < arr.length; ) {
    newArr.push(arr.slice(i, i + sliceLength));
    i += sliceLength;
  }

  return newArr;
}

export function fromHexStringToNumber(hexString: string): number {
  return Number(`0x${hexString}`);
}

export function fromHexToAscii(hexString: string): string {
  let str = '';
  for (let i = 0; i < hexString.length && hexString.substr(i, 2) !== '00'; i += 2)
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  return str;
}

export function fromHexToUtf8(hexString: string): string {
  const matchResult = hexString.match(/.{1,2}/g);
  if (matchResult !== null) {
    return decodeURIComponent('%' + matchResult.join('%')).replace(/\0/g, '');
  }
  return hexString;
}
