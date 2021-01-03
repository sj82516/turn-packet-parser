"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_types_1 = require("./index.types");
const util = require("./util");
const MagicCookie = '2112A442';
class TurnPacketParser {
    constructor() {
    }
    parse(rawData) {
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
        let stunMessage = {
            class: messageClass,
            method: messageMethod,
            transactionId: rawTransactionId
        };
        if (rawMessageAttributeList.length > 0) {
            const attributeList = {};
            stunMessage.attributeList = attributeList;
        }
        return stunMessage;
    }
    parseHeader(rawHeader) {
        const header = util.fromHexStringToNumber(rawHeader);
        let messageClass = '';
        const rawClass = (header & 0x0110);
        if (rawClass in index_types_1.MessageClass) {
            messageClass = index_types_1.MessageClass[rawClass];
        }
        const rawMethod = (header & 0x3e00) >> 2 | (header & 0x00e0) >> 1
            | (header & 0x000f);
        let messageMethod = '';
        if (rawMethod in index_types_1.MessageMethod) {
            messageMethod = index_types_1.MessageMethod[rawMethod];
        }
        return {
            messageMethod,
            messageClass
        };
    }
}
exports.default = TurnPacketParser;
const turnPacketParser = new TurnPacketParser();
const rawMessage = '000100002112a442415a31504a61494178597856';
const stunMessage = turnPacketParser.parse(rawMessage);
//# sourceMappingURL=index.js.map