import AddressParser from './addressParser';
import ErrorCodeParser from './errorCodeParser';
import ChannelNumberParser from './channelNumberParser';
import { AddressAttributeName, BaseAttribute, BasicAttributeName, XorAddressAttributeName } from '../index.types';
import TextParser from './textParser';
import BasicParser from './basicParser';

export default class ParserFactory {
  static create(attributeNum, attributeLength, rawAttributeData, { transactionId, MagicCookie }) {
    const { attributeType, attributeName } = this.detectAttributeType(attributeNum);
    const attribute: BaseAttribute = {
      length: attributeLength,
      value: rawAttributeData,
      name: attributeName,
    };

    switch (attributeType) {
      case 'address':
      case 'xorAddress':
        const isXor = attributeType === 'xorAddress';
        return new AddressParser(transactionId, MagicCookie, isXor, attribute);
      case 'error':
        return new ErrorCodeParser(attribute);
      case 'channelNumber':
        return new ChannelNumberParser(attribute);
      case 'utf8':
      case 'ascii':
        return new TextParser(attribute, attributeType);
      case 'basic':
      default:
        return new BasicParser(attribute);
    }
  }

  static detectAttributeType(attributeNum) {
    if (attributeNum in XorAddressAttributeName) {
      return {
        attributeType: 'xorAddress',
        attributeName: XorAddressAttributeName[attributeNum],
      };
    }
    if (attributeNum in AddressAttributeName) {
      return {
        attributeType: 'address',
        attributeName: AddressAttributeName[attributeNum],
      };
    }

    const asciiAttributeList = [BasicAttributeName.password, BasicAttributeName.username];
    if (asciiAttributeList.indexOf(attributeNum) > -1) {
      return {
        attributeType: 'ascii',
        attributeName: BasicAttributeName[attributeNum],
      };
    }

    const utf8AttributeList = [
      BasicAttributeName.realm,
      BasicAttributeName.software
    ];
    if (utf8AttributeList.indexOf(attributeNum) > -1) {
      return {
        attributeType: 'utf8',
        attributeName: BasicAttributeName[attributeNum],
      };
    }
    if (attributeNum === BasicAttributeName.channelNumber) {
      return {
        attributeType: 'channelNumber',
        attributeName: BasicAttributeName[attributeNum],
      };
    }
    if (attributeNum === BasicAttributeName.errorCode) {
      return {
        attributeType: 'error',
        attributeName: BasicAttributeName[attributeNum],
      };
    }
    return {
      attributeType: 'basic',
      attributeName: BasicAttributeName[attributeNum],
    };
  }
}
