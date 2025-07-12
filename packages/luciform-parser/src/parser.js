"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var tokenizer_js_1 = require("./tokenizer.js");
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.tokens = tokens;
        this.index = 0;
    }
    Parser.prototype.peek = function () {
        return this.tokens[this.index];
    };
    Parser.prototype.next = function () {
        return this.tokens[this.index++];
    };
    Parser.prototype.back = function () {
        this.index = Math.max(0, this.index - 1);
    };
    Parser.prototype.parse = function () {
        var tkn = this.next();
        if (!tkn) {
            this.fail("Unexpected end of input", this.index);
        }
        switch (tkn.type) {
            case tokenizer_js_1.Tokenizer.OBJ_OPEN:
                return this.parseObject();
            case tokenizer_js_1.Tokenizer.ARR_OPEN:
                return this.parseArray();
            case tokenizer_js_1.Tokenizer.STRING:
            case tokenizer_js_1.Tokenizer.NUMBER:
            case tokenizer_js_1.Tokenizer.SPECIAL:
                return tkn.value;
            default:
                this.back();
                this.fail(tkn);
        }
    };
    Parser.prototype.parseArray = function () {
        var start = this.index;
        var arr = [];
        var tkn;
        while (undefined !== (tkn = this.peek())) {
            if (tkn.type === tokenizer_js_1.Tokenizer.ARR_CLOSE) {
                this.next();
                return arr;
            }
            arr.push(this.parse());
        }
        this.fail("Opening bracket at position " + start + " has no corresponding closing one!", start);
        return arr; // Should not be reached
    };
    Parser.prototype.parseObject = function () {
        var start = this.index;
        var obj = {};
        var tkn;
        var key;
        var val;
        var indexForMissingKey = 0;
        while (undefined !== (tkn = this.peek())) {
            if (tkn.type === tokenizer_js_1.Tokenizer.OBJ_CLOSE) {
                this.next();
                return obj;
            }
            key = this.parse();
            tkn = this.peek();
            if (tkn && tkn.type === tokenizer_js_1.Tokenizer.OBJ_CLOSE) {
                obj[indexForMissingKey++] = key;
                this.next();
                return obj;
            }
            else if (tkn && tkn.type === tokenizer_js_1.Tokenizer.COLON) {
                this.next();
                val = this.parse();
                obj[key] = val;
            }
            else {
                // Missing key.
                obj[indexForMissingKey++] = key;
            }
        }
        this.fail("Opening brace at position " + start + " has no corresponding closing one!", start);
        return obj; // Should not be reached
    };
    Parser.prototype.fail = function (tkn, index) {
        if (typeof tkn === 'string') {
            throw { message: tkn, index: index };
        }
        throw {
            index: tkn.index,
            message: "Unexpected token " + tokenizer_js_1.Tokenizer.getTypeName(tkn.type) + " at position " + tkn.index + "!"
        };
    };
    return Parser;
}());
exports.Parser = Parser;
