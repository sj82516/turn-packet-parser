import { assert, expect } from "chai";

import TurnPacketParser from "../src/index";
import { AddressAttribute, ChannelData, ErrorAttribute, StunMessage } from "../src/index.types";

describe('', ()=>{
    it('parse bind request', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '000100002112a442415a31504a61494178597856';

        const stunMessage = turnPacketParser.parse(rawMessage);
        
        expect((<StunMessage>stunMessage)?.class).eql('request');
        expect((<StunMessage>stunMessage)?.method).eql('bind');
        expect((<StunMessage>stunMessage)?.transactionId).eql('415a31504a61494178597856');
    })

    it('parse success bind response with xor-parsed-address', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '0101000c2112a44274466a45716e437a67457242002000080001d8b41de7de90';

        const stunMessage = <StunMessage>turnPacketParser.parse(rawMessage);
        
        expect(stunMessage?.class).eql('response');
        expect(stunMessage?.method).eql('bind');
        expect(stunMessage?.transactionId).eql('74466a45716e437a67457242');

        expect((<AddressAttribute>stunMessage?.attributeList?.xorMappedAddress)?.address).eql('60.245.122.210');
        expect((<AddressAttribute>stunMessage?.attributeList?.xorMappedAddress)?.port).eql(63910);
    })

    it('parse success bind response with xor-parsed-address', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '010100542112a4426469794c6c7945666178704e002000080001c8c18d07a443000100080001e9d3ac150001802b000800010d96ac150003802c000800010d97ac15000380220018436f7475726e2d342e352e32202764616e2045696465722780280004eb888df2';

        const stunMessage = turnPacketParser.parse(rawMessage);

        if(stunMessage?.type === 'stunMessage'){
            expect(stunMessage.class).eql('response');
            expect(stunMessage.method).eql('bind');
            expect(stunMessage.transactionId).eql('6469794c6c7945666178704e');

            expect(stunMessage.attributeList?.xorMappedAddress?.address).eql('172.21.0.1');
            expect(stunMessage.attributeList?.xorMappedAddress?.port).eql(59859);
        } else {
            throw "message type error"
        }
    })

    it('parse error code', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '0113005c2112a44249542f6b70462b354a2b71690009001000000401556e617574686f72697a65640015001062376362613066303631386634356262001400096c6f63616c686f737400000080220018436f7475726e2d342e352e32202764616e2045696465722780280004317f126c';

        const stunMessage = <StunMessage>turnPacketParser.parse(rawMessage);
        
        expect(stunMessage?.class).eql('errorResponse');
        expect(stunMessage?.method).eql('allocate');
        expect(stunMessage?.transactionId).eql('49542f6b70462b354a2b7169');
        expect(stunMessage?.attributeList?.errorCode?.code).eql('401');
        expect(stunMessage?.attributeList?.errorCode?.reason).eql('Unauthorized');
    })

    it('parse create permission', ()=>{
        const rawMessage = '000800542112a4426c75552f776e76442b54434a001200080001063c8d07a4410006000568656c6c6f000000001400096c6f63616c686f7374000000001500103562306138626364343063323963303400080014a7aca6b10d1381f53ccb9a104442f61d5303b9f4';
        const turnPacketParser = new TurnPacketParser();

        const stunMessage = <StunMessage>turnPacketParser.parse(rawMessage);
        expect(stunMessage?.class).eql('request');
        expect(stunMessage?.method).eql('createPermission');
        expect(stunMessage?.transactionId).eql('6c75552f776e76442b54434a');
        expect(stunMessage?.attributeList?.xorPeerAddress?.address).eql('172.21.0.3');
        expect(stunMessage?.attributeList?.xorPeerAddress?.port).eql(10030);
        expect(stunMessage?.attributeList?.username?.value).eql('hello');
        expect(stunMessage?.attributeList?.realm?.value).eql('localhost');
    })

    it('parse channel data', ()=>{
        const turnPacketParser = new TurnPacketParser();
        const rawMessage = '40000222';

        const channelData = <ChannelData>turnPacketParser.parse(rawMessage);
        
        expect(channelData.number).eql(0x4000);
        expect(channelData.length).eql(546);
    })
})