import { AddressAttribute, BaseAttribute, BasicAttribute, Parser } from '../index.types';
import * as util from '../util';

export default class AddressParser implements Parser {
  constructor(
    private transactionId,
    private MagicCookie,
    private isXor,
    private attribute: BaseAttribute,
  ) {

  }

  parse() {
    const family = util.fromHexStringToNumber(this.attribute.value.slice(2, 4));
    let rawPort = this.attribute.value.slice(4, 8);
    let rawIp = family === 1 ? this.attribute.value.slice(8, 16) : this.attribute.value.slice(8, 32);

    if (this.isXor) {
      rawIp = this.revertXorIp(rawIp, family, this.transactionId, this.MagicCookie);
      rawPort = this.revertXorPort(rawPort, this.MagicCookie);
    }

    const port = util.fromHexStringToNumber(rawPort);
    const address = util.fromHexStringToIp(rawIp, family) as string;

    const addressAttribute: AddressAttribute = {
      family,
      port,
      address,
      ... this.attribute,
      type: 'address'
    };

    return addressAttribute;
  }

  // https://tools.ietf.org/html/rfc8489
  // 14.2.  XOR-MAPPED-ADDRESS
  private revertXorIp(rawIp, ipFamily, transactionId, MagicCookie): string {
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
        ip += this.convertPartIpv4ToHex(partIP);
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

  private revertXorPort(rawPort, MagicCookie): string {
    return (util.fromHexStringToNumber(rawPort) ^ util.fromHexStringToNumber(MagicCookie.slice(0, 4))).toString(16);
  }

  private convertPartIpv4ToHex(partIp: string): string {
    return partIp.length < 2 ? `0${partIp}` : partIp;
  }
}