"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const util = require("../util");
describe('parseHexStringToIP', () => {
    it('expect parse ipv4 raw hex string to ip', () => {
        const rawHexString = "c0a86464";
        const ip = util.parseHexStringToIP(rawHexString, 4);
        chai.expect(ip).to.be.eql("192.168.100.100");
    });
});
describe('fromHexStringToNumber', () => {
    it('expect hex string to number', () => {
        const rawHexString = "1f";
        const num = util.fromHexStringToNumber(rawHexString);
        chai.expect(num).to.be.eql(31);
    });
});
//# sourceMappingURL=util.spec.js.map