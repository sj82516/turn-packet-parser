import * as chai from "chai";

import * as util from "../src/util";

describe('parseHexStringToIP', ()=>{
    it('expect parse ipv4 raw hex string to ip', ()=>{
        const rawHexString = "c0a86464";
        const ip = util.fromHexStringToIp(rawHexString, 1);
        chai.expect(ip).to.be.eql("192.168.100.100");
    });
});

describe('fromHexStringToNumber', ()=>{
    it('expect hex string to number', ()=>{
        const rawHexString = "1f";
        const num = util.fromHexStringToNumber(rawHexString);
        chai.expect(num).to.be.eql(31);
    });
});