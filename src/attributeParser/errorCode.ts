import { BasicAttribute, ErrorAttribute } from '../index.types';
import * as util from '../util';

export default function parseErrorCode(attribute: BasicAttribute, errorCodeData: string): ErrorAttribute {
    // preserved 0000
    const errorClass = util.fromHexStringToNumber(errorCodeData.slice(4, 6));
    const errorCode = util.fromHexStringToNumber(errorCodeData.slice(6, 8));

    const errorAttribute: ErrorAttribute = {
        code: formErrorCode(errorClass, errorCode),
        reason: util.fromHexToAscii(errorCodeData.slice(8)),
        ...attribute,
        type: 'error'
    };

    return errorAttribute;
}

function formErrorCode(type, code) {
    if (code < 10) {
        return `${type}0${code}`;
    }
    return `${type}${code}`;
}