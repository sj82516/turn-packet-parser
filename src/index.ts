import {
    MessageClass,
    MessageMethod,
    StunMessage,
    AttributeList,
    Attribute,
    ErrorAttribute,
    AddressAttributeName,
    BasicAttributeName,
    BasicAttribute,
    AddressAttribute,
} from './index.types';

import * as util from './util';

const MagicCookie = '2112a442';
export default class TurnPacketParser {
    parse(rawData: string): StunMessage | null {
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
                    const {
                        code,
                        reason,
                    } = this.parseErrorCode(rawData);

                    attribute = <ErrorAttribute>{
                        ... attribute,
                        code,
                        reason
                    }
                }

                attributeList[BasicAttributeName[attributeName]] = attribute;
            }

            if (attributeName in AddressAttributeName) {
                const family = util.fromHexStringToNumber(rawAttributeData.slice(idx + 10, idx + 12));
                let rawPort = rawAttributeData.slice(idx + 12, idx + 16);
                let rawIp =
                    family === 1 ? rawAttributeData.slice(idx + 16, idx + 24) : rawAttributeData.slice(idx + 16, idx + 40);

                const xorAddressAttribute = [0x0012, 0x0016, 0x0020];

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
            reason: util.fromHexToAscii(errorCodeData.slice(8))
        }
        return error;
    }
    private formErrorCode(type, code) {
        if (code < 10) {
            return `${type}0${code}`
        }
        return `${type}${code}`
    }

    // https://tools.ietf.org/html/rfc8489
    // 14.2.  XOR-MAPPED-ADDRESS
    private revertXorIp(rawIp, ipFamily, transactionId): string {
        if (ipFamily === 1) {
            return (util.fromHexStringToNumber(rawIp) ^ util.fromHexStringToNumber(MagicCookie)).toString(16);
        }

        const xorString = MagicCookie + transactionId;
        return (util.fromHexStringToNumber(rawIp) ^ util.fromHexStringToNumber(xorString)).toString(16);
    }
    private revertXorPort(rawPort): string {
        return (util.fromHexStringToNumber(rawPort) ^ util.fromHexStringToNumber(MagicCookie.slice(0, 4))).toString(16);
    }
}
