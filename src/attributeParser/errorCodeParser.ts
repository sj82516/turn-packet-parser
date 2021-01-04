import { BaseAttribute, BasicAttribute, ErrorAttribute, Parser } from '../index.types';
import * as util from '../util';

export default class ErrorCodeParser implements Parser {
  constructor(private attribute: BaseAttribute) {}

  parse() {
    // preserved 0000
    const errorClass = util.fromHexStringToNumber(this.attribute.value.slice(4, 6));
    const errorCode = util.fromHexStringToNumber(this.attribute.value.slice(6, 8));

    const errorAttribute: ErrorAttribute = {
      code: this.formErrorCode(errorClass, errorCode),
      reason: util.fromHexToAscii(this.attribute.value.slice(8)),
      ...this.attribute,
      type: 'error',
    };

    return errorAttribute;
  }

  formErrorCode(type, code) {
    if (code < 10) {
      return `${type}0${code}`;
    }
    return `${type}${code}`;
  }
}
