import AddressParser from './addressParser';
import ErrorCodeParser from './errorCodeParser';
import { AddressAttributeName, BaseAttribute, BasicAttributeName, XorAddressAttributeName } from '../index.types';
import * as util from '../util';

export default class ParserFactory {
    static create(attributeNum, attributeLength, rawAttributeData, {
        transactionId, MagicCookie,
    }) {
        const rawData = rawAttributeData.slice(8, attributeLength);

        const { attributeType, attributeName } = this.detectAttributeType(attributeNum);
        let attribute: BaseAttribute = {
            length: attributeLength,
            value: rawData,
            name: attributeName
        };

        switch (attributeType) {
            case 'address':
            case 'xorAddress':
                const isXor = attributeType === 'xorAddress';
                return new AddressParser(transactionId, MagicCookie, isXor, attribute)
            case 'error':
                return new ErrorCodeParser(attribute);
            case 'basic':
            default:
                return new ErrorCodeParser(attribute);
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
        if (attributeNum === BasicAttributeName.username) {
            return {
                attributeType: 'username',
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
