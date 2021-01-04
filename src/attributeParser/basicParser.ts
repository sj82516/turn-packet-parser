import * as util from "../util";
import { BaseAttribute, Parser } from "../index.types";

export default class AsciiParser {
    constructor(
        private attribute: BaseAttribute,
    ) {

    }
    
    parse(){
        return this.attribute;
    }
}