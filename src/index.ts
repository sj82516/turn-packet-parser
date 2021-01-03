import {
  MessageClass,
  MessageMethod,
  StunMessage,
  AttributeList,
  ChannelData,
  ErrorAttribute,
  AddressAttributeName,
  BasicAttributeName,
  BasicAttribute,
  AddressAttribute,
} from './index.types';

import * as util from './util';

const MagicCookie = '2112a442';
export default class TurnPacketParser {
  parse(rawData: string): ChannelData | StunMessage | null {
    const channelData = this.parseChannelData(rawData);
    if (channelData) {
      return channelData;
    }

    const rawHeader = rawData.slice(0, 4);
    const rawMessageLength = rawData.slice(4, 8);
    const rawMagicCookie = rawData.slice(8, 16);
    const rawTransactionId = rawData.slice(16, 40);
    const rawMessageAttributeList = rawData.slice(40);

    const { messageMethod, messageClass } = this.parseHeader(rawHeader);

    // not valid stun message
    if (rawMagicCookie !== MagicCookie) {
      return null;
    }

    const stunMessage: StunMessage = {
      class: messageClass,
      method: messageMethod,
      transactionId: rawTransactionId,
    };

    if (rawMessageAttributeList.length > 0) {
      stunMessage.attributeList = this.parseAttributes(rawMessageAttributeList, rawTransactionId);
    }

    return stunMessage;
  }

  // https://tools.ietf.org/html/rfc8656
  // 3.5
  // The packet format of ChannelData is different with other stun/turn packet
  // The first four byte is for channel number
  // the detection is quite simply , if the channel number is in valid range, from 0x4000 through 0x4FFF. we consinder it as valid message
  private parseChannelData(rawData): ChannelData | null {
    const channelNumber = util.fromHexStringToNumber(rawData.slice(0, 4));
    if (channelNumber > 0x4fff || channelNumber < 0x4000) {
      return null;
    }

    return {
      number: channelNumber,
      length: util.fromHexStringToNumber(rawData.slice(4, 8)),
    };
  }

  private parseHeader(
    rawHeader: string,
  ): {
    messageMethod: keyof typeof MessageMethod | '';
    messageClass: keyof typeof MessageClass | '';
  } {
    const header = util.fromHexStringToNumber(rawHeader);
    let messageClass = '' as keyof typeof MessageClass;
    const rawClass = header & 0x0110;
    if (rawClass in MessageClass) {
      messageClass = MessageClass[rawClass] as keyof typeof MessageClass;
    }

    const rawMethod = ((header & 0x3e00) >> 2) | ((header & 0x00e0) >> 1) | (header & 0x000f);
    let messageMethod = '' as keyof typeof MessageMethod;
    if (rawMethod in MessageMethod) {
      messageMethod = MessageMethod[rawMethod] as keyof typeof MessageMethod;
    }

    return {
      messageMethod,
      messageClass,
    };
  }

  private parseAttributes(rawAttributeData: string, transactionId: string): AttributeList {
    const attributeList: AttributeList = {};
    let idx = 0;
    while (idx < rawAttributeData.length) {
      const attributeName = util.fromHexStringToNumber(rawAttributeData.slice(idx, idx + 4));
      const rawAttributeLength = rawAttributeData.slice(idx + 4, idx + 8);
      const length = util.fromHexStringToNumber(rawAttributeLength);
      const rawData = rawAttributeData.slice(idx + 8, idx + 8 + 2 * length);

      if (attributeName in BasicAttributeName) {
        let attribute: BasicAttribute = {
          length,
          value: rawData,
        };

        if (attributeName === BasicAttributeName.errorCode) {
          const { code, reason } = this.parseErrorCode(rawData);

          attribute = {
            ...attribute,
            code,
            reason,
          } as ErrorAttribute;
        }

        attributeList[BasicAttributeName[attributeName]] = attribute;
      }

      if (attributeName in AddressAttributeName) {
        const family = util.fromHexStringToNumber(rawAttributeData.slice(idx + 10, idx + 12));
        let rawPort = rawAttributeData.slice(idx + 12, idx + 16);
        let rawIp =
          family === 1 ? rawAttributeData.slice(idx + 16, idx + 24) : rawAttributeData.slice(idx + 16, idx + 40);

        const xorAddressAttribute = [
          AddressAttributeName.xorMappedAddress,
          AddressAttributeName.xorPeerAddress,
          AddressAttributeName.xorRelayedAddress,
        ];

        if (xorAddressAttribute.indexOf(attributeName) > -1) {
          rawIp = this.revertXorIp(rawIp, family, transactionId);
          rawPort = this.revertXorPort(rawPort);
        }

        const port = util.fromHexStringToNumber(rawPort);
        const address = util.fromHexStringToIp(rawIp, family) as string;

        const attribute: AddressAttribute = {
          family,
          port,
          address,
          length,
          value: rawData,
        };
        attributeList[AddressAttributeName[attributeName]] = attribute;
      }

      idx = idx + 8 + 2 * length;
    }

    return attributeList;
  }

  private parseErrorCode(errorCodeData: string) {
    // preserved 0000
    const errorClass = util.fromHexStringToNumber(errorCodeData.slice(4, 6));
    const errorCode = util.fromHexStringToNumber(errorCodeData.slice(6, 8));
    const error = {
      code: this.formErrorCode(errorClass, errorCode),
      reason: util.fromHexToAscii(errorCodeData.slice(8)),
    };
    return error;
  }
  private formErrorCode(type, code) {
    if (code < 10) {
      return `${type}0${code}`;
    }
    return `${type}${code}`;
  }

  // https://tools.ietf.org/html/rfc8489
  // 14.2.  XOR-MAPPED-ADDRESS
  private revertXorIp(rawIp, ipFamily, transactionId): string {
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
  private revertXorPort(rawPort): string {
    return (util.fromHexStringToNumber(rawPort) ^ util.fromHexStringToNumber(MagicCookie.slice(0, 4))).toString(16);
  }
  private convertPartIpv4ToHex(partIp: string): string {
    return partIp.length < 2 ? `0${partIp}` : partIp;
  }
}
