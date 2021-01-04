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

describe('fromHexStringToAscii', ()=>{
    it('expect hex string to ascii', ()=>{
        const rawHexString = "556e617574686f72697a6564";
        const asciiString = util.fromHexToAscii(rawHexString);
        chai.expect(asciiString).to.be.eql("Unauthorized");
    });
})

describe('fromHexStringToUtf8', ()=>{
    it('expect hex string to ascii', ()=>{
        const rawHexString = "6c6f63616c686f7374";
        const utf8String = util.fromHexToAscii(rawHexString);
        chai.expect(utf8String).to.be.eql("localhost");
    });
})