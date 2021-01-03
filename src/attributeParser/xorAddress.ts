import { AddressAttribute, BasicAttribute } from '../index.types';
import * as util from '../util';

export default function parseXorAddress(
  attribute: BasicAttribute,
  rawAttributeData,
  idx: number,
  transactionId: string,
  MagicCookie: string,
  isXor: boolean,
): AddressAttribute {
  const family = util.fromHexStringToNumber(rawAttributeData.slice(idx + 10, idx + 12));
  let rawPort = rawAttributeData.slice(idx + 12, idx + 16);
  let rawIp = family === 1 ? rawAttributeData.slice(idx + 16, idx + 24) : rawAttributeData.slice(idx + 16, idx + 40);

  if (isXor) {
    rawIp = revertXorIp(rawIp, family, transactionId, MagicCookie);
    rawPort = revertXorPort(rawPort, MagicCookie);
  }

  const port = util.fromHexStringToNumber(rawPort);
  const address = util.fromHexStringToIp(rawIp, family) as string;

  const addressAttribute: AddressAttribute = {
    family,
    port,
    address,
    ...attribute,
    type: 'address',
  };

  return addressAttribute;
}

// https://tools.ietf.org/html/rfc8489
// 14.2.  XOR-MAPPED-ADDRESS
function revertXorIp(rawIp, ipFamily, transactionId, MagicCookie): string {
  // to prevent overflow, revert ip one by one
  let ip = '';
  if (ipFamily === 1) {
    for (let i = 0; i < 4; i++) {
      const stringStart = 2 * i;
      const stringEnd = 2 * i + 2;
      const partIP = (
        util.fromHexStringToNumber(rawIp.slice(stringStart, stringEnd)) ^
        util.fromHexStringToNumber(MagicCookie.slice(stringStart, stringEnd))
      ).toString(16);
      ip += convertPartIpv4ToHex(partIP);
    }
    return ip;
  }

  const xorString = MagicCookie + transactionId;
  for (let i = 0; i < 6; i++) {
    const stringStart = 4 * i;
    const stringEnd = 4 * i + 4;
    ip += (
      util.fromHexStringToNumber(rawIp.slice(stringStart, stringEnd)) ^
      util.fromHexStringToNumber(xorString.slice(stringStart, stringEnd))
    ).toString(16);
  }
  return ip;
}

function revertXorPort(rawPort, MagicCookie): string {
  return (util.fromHexStringToNumber(rawPort) ^ util.fromHexStringToNumber(MagicCookie.slice(0, 4))).toString(16);
}

function convertPartIpv4ToHex(partIp: string): string {
  return partIp.length < 2 ? `0${partIp}` : partIp;
}
