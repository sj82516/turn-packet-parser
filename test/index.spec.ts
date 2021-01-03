import { expect } from "chai";

import TurnPacketParser from "../src/index";
import { AddressAttribute, ErrorAttribute } from "../src/index.types";

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

        expect((<AddressAttribute>stunMessage?.attributeList?.xorMappedAddress)?.address).eql('60.245.122.210');
        expect((<AddressAttribute>stunMessage?.attributeList?.xorMappedAddress)?.port).eql(63910);
    })

    it('parse error code', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '0113005c2112a44249542f6b70462b354a2b71690009001000000401556e617574686f72697a65640015001062376362613066303631386634356262001400096c6f63616c686f737400000080220018436f7475726e2d342e352e32202764616e2045696465722780280004317f126c';

        const stunMessage = turnPacketParser.parse(rawMessage);
        
        expect(stunMessage?.class).eql('errorResponse');
        expect(stunMessage?.method).eql('allocate');
        expect(stunMessage?.transactionId).eql('49542f6b70462b354a2b7169');
        expect((<ErrorAttribute>stunMessage?.attributeList?.errorCode)?.code).eql('401');
        expect((<ErrorAttribute>stunMessage?.attributeList?.errorCode)?.reason).eql('Unauthorized');
    })
})