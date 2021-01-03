"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicationStunType = exports.RequestResponseStunType = exports.AddressAttributeName = exports.BasicAttributeName = exports.MessageMethod = exports.MessageClass = void 0;
var MessageClass;
(function (MessageClass) {
    MessageClass[MessageClass["request"] = 0] = "request";
    MessageClass[MessageClass["response"] = 16] = "response";
    MessageClass[MessageClass["indication"] = 256] = "indication";
    MessageClass[MessageClass["errorResponse"] = 272] = "errorResponse";
})(MessageClass = exports.MessageClass || (exports.MessageClass = {}));
var MessageMethod;
(function (MessageMethod) {
    MessageMethod[MessageMethod["bind"] = 1] = "bind";
    MessageMethod[MessageMethod["allocate"] = 3] = "allocate";
    MessageMethod[MessageMethod["refresh"] = 4] = "refresh";
    MessageMethod[MessageMethod["send"] = 6] = "send";
    MessageMethod[MessageMethod["data"] = 7] = "data";
    MessageMethod[MessageMethod["createPermission"] = 8] = "createPermission";
    MessageMethod[MessageMethod["channelBind"] = 9] = "channelBind";
})(MessageMethod = exports.MessageMethod || (exports.MessageMethod = {}));
var BasicAttributeName;
(function (BasicAttributeName) {
    BasicAttributeName[BasicAttributeName["changeRequest"] = 3] = "changeRequest";
    BasicAttributeName[BasicAttributeName["username"] = 6] = "username";
    BasicAttributeName[BasicAttributeName["password"] = 7] = "password";
    BasicAttributeName[BasicAttributeName["messageIntegrity"] = 8] = "messageIntegrity";
    BasicAttributeName[BasicAttributeName["errorCode"] = 9] = "errorCode";
    BasicAttributeName[BasicAttributeName["unknownAttributes"] = 10] = "unknownAttributes";
    BasicAttributeName[BasicAttributeName["reflectedFrom"] = 11] = "reflectedFrom";
    BasicAttributeName[BasicAttributeName["channelNumber"] = 12] = "channelNumber";
    BasicAttributeName[BasicAttributeName["lifetime"] = 13] = "lifetime";
    BasicAttributeName[BasicAttributeName["data"] = 19] = "data";
    BasicAttributeName[BasicAttributeName["requestedAddressFamily"] = 23] = "requestedAddressFamily";
    BasicAttributeName[BasicAttributeName["evenPort"] = 24] = "evenPort";
    BasicAttributeName[BasicAttributeName["requestedTransport"] = 25] = "requestedTransport";
    BasicAttributeName[BasicAttributeName["dontFragment"] = 26] = "dontFragment";
    BasicAttributeName[BasicAttributeName["reservationToken"] = 34] = "reservationToken";
    BasicAttributeName[BasicAttributeName["additionalAddressFamily"] = 32768] = "additionalAddressFamily";
    BasicAttributeName[BasicAttributeName["addressErrorCode"] = 32769] = "addressErrorCode";
    BasicAttributeName[BasicAttributeName["ICMP"] = 32772] = "ICMP";
})(BasicAttributeName = exports.BasicAttributeName || (exports.BasicAttributeName = {}));
var AddressAttributeName;
(function (AddressAttributeName) {
    AddressAttributeName[AddressAttributeName["mappedAddress"] = 1] = "mappedAddress";
    AddressAttributeName[AddressAttributeName["responseAddress"] = 2] = "responseAddress";
    AddressAttributeName[AddressAttributeName["sourceAddress"] = 4] = "sourceAddress";
    AddressAttributeName[AddressAttributeName["changedAddress"] = 5] = "changedAddress";
    AddressAttributeName[AddressAttributeName["xorPeerAddress"] = 18] = "xorPeerAddress";
    AddressAttributeName[AddressAttributeName["xorRelayedAddress"] = 22] = "xorRelayedAddress";
})(AddressAttributeName = exports.AddressAttributeName || (exports.AddressAttributeName = {}));
var RequestResponseStunType;
(function (RequestResponseStunType) {
    RequestResponseStunType["Allocate"] = "3";
    RequestResponseStunType["Refresh"] = "4";
    RequestResponseStunType["CreatePermission"] = "8";
    RequestResponseStunType["ChannelBind"] = "9";
})(RequestResponseStunType = exports.RequestResponseStunType || (exports.RequestResponseStunType = {}));
var IndicationStunType;
(function (IndicationStunType) {
    IndicationStunType["Send"] = "6";
    IndicationStunType["Data"] = "7";
})(IndicationStunType = exports.IndicationStunType || (exports.IndicationStunType = {}));
//# sourceMappingURL=index.types.js.map