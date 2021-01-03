# Turn Packet Parser  
Turn packet parser with fully type support and zero dependency on other modules. (exclude devDependency)   

Parse the binary string to the messages defined in [rfc 8489 - Session Traversal Utilities for NAT](https://tools.ietf.org/html/rfc8489) and [rfc 8656 - Traversal Using Relays around NAT (TURN)](https://tools.ietf.org/html/rfc8656).  

## Example
You can play on runKit https://runkit.com/sj82516/5ff13005da38dc001a7ba9c1  

```js
var TurnPacketParser = require("turn-packet-parser").default;
const parser = new TurnPacketParser();
const rawBinaryString = "0101000c2112a44274466a45716e437a67457242002000080001d8b41de7de90";
const stunMessage = parser.parse(rawBinaryString);
console.log(JSON.stringify(stunMessage))

//// output
 {
    "class": "response",
    "method": "bind",
    "transactionId": "74466a45716e437a67457242",
    "attributeList": {
        "xorMappedAddress": {
            "family": 1,
            "port": 63910,
            "address": "60.245.122.210",
            "length": 8,
            "value": "0001d8b41de7de90"
        }
    }
}
```