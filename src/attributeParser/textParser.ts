import * as util from '../util';
import { BaseAttribute, Parser } from '../index.types';

export default class TextParser implements Parser {
  constructor(private attribute: BaseAttribute, private type = 'ascii') {}
  parse() {
    const method = this.type === 'ascii' ? util.fromHexToAscii : util.fromHexToUtf8;
    return {
      ...this.attribute,
      value: method(this.attribute.value).trim(),
    };
  }
}
