import { expect } from "chai";

import TurnPacketParser from "../src/index";

describe('', ()=>{
    it('parse bind request', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '000100002112a442415a31504a61494178597856';

        const stunMessage = turnPacketParser.parse(rawMessage);
        
        expect(stunMessage?.class).eql('request');
        expect(stunMessage?.method).eql('bind');
        expect(stunMessage?.transactionId).eql('415a31504a61494178597856');
    })

    it('parse success bind response with xor-parsed-address', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '0101000c2112a44274466a45716e437a67457242002000080001d8b41de7de90';

        const stunMessage = turnPacketParser.parse(rawMessage);
        
        expect(stunMessage?.class).eql('response');
        expect(stunMessage?.method).eql('bind');
        expect(stunMessage?.transactionId).eql('74466a45716e437a67457242');

        expect(stunMessage?.attributeList?.xorMappedAddress?.address).eql('60.245.122.210');
        expect(stunMessage?.attributeList?.xorMappedAddress?.port).eql(63910);
    })
})