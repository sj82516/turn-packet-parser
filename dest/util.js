"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromHexStringToNumber = exports.parseHexStringToIP = void 0;
function parseHexStringToIP(rawIp, ipFamily) {
    let sliceLength = ipFamily === 4 ? 2 : 4;
    if (ipFamily === 4 && rawIp.length !== 8) {
        throw "Invalid ipV4 Length";
    }
    if (ipFamily === 6 && rawIp.length !== 24) {
        throw "Invalid ipV6 Length";
    }
    const ip = sliceArrayToBatch(rawIp.split(""), sliceLength).map((s) => fromHexStringToNumber(s.join("")));
    return ip.join(".");
}
exports.parseHexStringToIP = parseHexStringToIP;
function sliceArrayToBatch(arr, sliceLength) {
    const newArr = [];
    for (let i = 0; i < arr.length;) {
        newArr.push(arr.slice(i, i + sliceLength));
        i += sliceLength;
    }
    return newArr;
}
function fromHexStringToNumber(hexString) {
    return Number(`0x${hexString}`);
}
exports.fromHexStringToNumber = fromHexStringToNumber;
//# sourceMappingURL=util.js.map