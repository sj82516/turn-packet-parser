"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../index");
describe('', () => {
    it('parse ', () => {
        const turnPacketParser = new index_1.default();
        const rawMessage = '000100002112a442415a31504a61494178597856';
        const stunMessage = turnPacketParser.parse(rawMessage);
        console.log(stunMessage);
        chai_1.expect(stunMessage === null || stunMessage === void 0 ? void 0 : stunMessage.class).eql('request');
        chai_1.expect(stunMessage === null || stunMessage === void 0 ? void 0 : stunMessage.method).eql('bind');
        chai_1.expect(stunMessage === null || stunMessage === void 0 ? void 0 : stunMessage.transactionId).eql('415a31504a61494178597856');
    });
});
//# sourceMappingURL=index.spec.js.map