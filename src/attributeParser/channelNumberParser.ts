import * as util from '../util';
import { BaseAttribute, Parser } from '../index.types';

export default class ChannelNumberParser implements Parser {
  constructor(private attribute: BaseAttribute) {}
  parse() {
    return {
      ...this.attribute,
      value: this.attribute.value.slice(0, 4),
    };
  }
}
