import {
  MessageClass,
  MessageMethod,
  StunMessage,
  AttributeList,
  ChannelData,
  AddressAttributeName,
  BasicAttributeName,
  XorAddressAttributeName,
  BasicAttribute,
  BaseAttribute,
} from './index.types';

import ParserFactory from './attributeParser';

import * as util from './util';

const MagicCookie = '2112a442';
export default class TurnPacketParser {
  parse(rawData: string): ChannelData | StunMessage | null {
    const type = this.checkDataType(rawData);
    if (type === null) {
      return null;
    }

    if (type === 'channelData') {
      const channelData = this.parseChannelData(rawData);
      if (channelData) {
        return channelData;
      }
    } else {
      const rawHeader = rawData.slice(0, 4);
      const rawMessageLength = rawData.slice(4, 8);

      const { messageMethod, messageClass } = this.parseHeader(rawHeader);

      const rawMagicCookie = rawData.slice(8, 16);
      const rawTransactionId = rawData.slice(16, 40);
      const rawMessageAttributeList = rawData.slice(40);

      // not valid stun message
      if (rawMagicCookie !== MagicCookie) {
        return null;
      }

      const stunMessage: StunMessage = {
        type,
        class: messageClass,
        method: messageMethod,
        transactionId: rawTransactionId,
      };

      if (rawMessageAttributeList.length > 0) {
        stunMessage.attributeList = this.parseAttributes(rawMessageAttributeList, rawTransactionId);
      }

      return stunMessage;
    }

    return null;
  }

  private checkDataType(rawData) {
    const firstFourByte = util.fromHexStringToNumber(rawData.slice(0, 4));
    if (firstFourByte < 0x4000) {
      return 'stunMessage';
    } else if (firstFourByte >= 0x4fff) {
      return null;
    } else {
      return 'channelData';
    }
  }

  // https://tools.ietf.org/html/rfc8656
  // 3.5
  // The packet format of ChannelData is different with other stun/turn packet
  // The first four byte is for channel number
  // the detection is quite simply , if the channel number is in valid range, from 0x4000 through 0x4FFF. we consinder it as valid message
  private parseChannelData(rawData): ChannelData | null {
    const channelNumber = util.fromHexStringToNumber(rawData.slice(0, 4));
    return {
      type: 'channelData',
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
      const { attributeNum, attributeLength, rawAttributeValueData } = this.parseCurrentAttributeNameAndLength(
        rawAttributeData,
        idx,
      );

      const parser = ParserFactory.create(attributeNum, attributeLength, rawAttributeValueData, {
        transactionId,
        MagicCookie,
      });

      const attribute = parser.parse();
      attributeList[attribute.name] = attribute;

      idx += attributeLength;
    }

    return attributeList;
  }

  private parseCurrentAttributeNameAndLength(rawAttributeData: string, idx: number) {
    const attributeNum = util.fromHexStringToNumber(rawAttributeData.slice(idx + 0, idx + 4));
    const rawLength = util.fromHexStringToNumber(rawAttributeData.slice(idx + 4, idx + 8));
    const patchPaddingLength = this.patchPadding(rawLength);
    const attributeLength = 8 + patchPaddingLength * 2;
    const attributeValueLength = 8 + rawLength * 2;
    const rawAttributeValueData = rawAttributeData.slice(idx + 8, idx + attributeValueLength);

    return {
      attributeNum,
      attributeLength,
      rawAttributeValueData,
    };
  }

  private patchPadding(length: number) {
    const remain = length % 4;
    return remain === 0 ? length : length + 4 - remain;
  }
}
