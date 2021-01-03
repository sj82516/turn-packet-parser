export interface StunMessage {
  class: '' | keyof typeof MessageClass;
  method: '' | keyof typeof MessageMethod;
  transactionId: string;

  attributeList?: AttributeList;
}

export enum MessageClass {
  request = 0x0000,
  indication = 0x0010,
  response = 0x0100,
  errorResponse = 0x0110,
}

export enum MessageMethod {
  bind = 0x001,
  allocate = 0x003,
  refresh = 0x004,
  send = 0x006,
  data = 0x007,
  createPermission = 0x008,
  channelBind = 0x009,
}

export type AttributeList = {
  [K in AttributeName]?: Attribute;
};

export type AttributeName = keyof typeof BasicAttributeName | keyof typeof AddressAttributeName;

export enum BasicAttributeName {
  changeRequest = 0x0003,
  username = 0x0006,
  password = 0x0007,
  messageIntegrity = 0x0008,
  errorCode = 0x0009,
  unknownAttributes = 0x000a,
  reflectedFrom = 0x000b,
  channelNumber = 0x000c,
  lifetime = 0x000d,
  data = 0x0013,
  requestedAddressFamily = 0x0017,
  evenPort = 0x0018,
  requestedTransport = 0x0019,
  dontFragment = 0x001a,
  reservationToken = 0x0022,
  additionalAddressFamily = 0x8000,
  addressErrorCode = 0x8001,
  ICMP = 0x8004,
}

export enum AddressAttributeName {
  mappedAddress = 0x0001,
  responseAddress = 0x0002,
  sourceAddress = 0x0004,
  changedAddress = 0x0005,
  xorPeerAddress = 0x0012,
  xorRelayedAddress = 0x0016,
  xorMappedAddress = 0x0020,
}

export type Attribute = BasicAttribute | ErrorAttribute | AddressAttribute;

export interface BasicAttribute {
  length: number;
  value: string;
}

export interface ErrorAttribute extends BasicAttribute {
  code: string,
  reason: string
}

export interface AddressAttribute extends BasicAttribute {
  family: number;
  port: number;
  address: string;
}

export enum RequestResponseStunType {
  Allocate = '3',
  Refresh = '4',
  CreatePermission = '8',
  ChannelBind = '9',
}

export enum IndicationStunType {
  Send = '6',
  Data = '7',
}
