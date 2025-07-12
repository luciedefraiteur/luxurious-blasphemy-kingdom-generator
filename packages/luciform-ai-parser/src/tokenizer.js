"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var types_1 = require("./types");
var TYPE_NAMES = [
    "???",
    "OBJ_OPEN", "OBJ_CLOSE", "ARR_OPEN", "ARR_CLOSE",
    "STRING", "NUMBER", "SPECIAL", "COLON",
    "NEWLINE", "ACTION_START", "PAS_SEPARATOR", "LUCIFORM_SYGIL", "LEGACY_COMMAND"
];
var Context = /** @class */ (function () {
    function Context() {
        this.RX_DECIMAL = /^-?(\.[0-9]+|[0-9]+(\.[0-9]+)?)([eE]-?[0-9]+)?$/;
        this.RX_HEXA = /^-?0x[0-9a-f]+$/i;
        this.RX_OCTAL = /^-?0o[0-7]+$/i;
        this.RX_BINARY = /^-?0b[01]+$/i;
        this.eaters = [
            this.eatBlanks.bind(this),
            this.eatSymbol.bind(this),
            this.eatComment.bind(this),
            this.eatMultilineString.bind(this),
            this.eatString.bind(this),
            this.eatIdentifier.bind(this)
        ];
        this.source = '';
        this.end = 0;
        this.index = 0;
        this.tokens = [];
    }
    Context.prototype.tokenize = function (source) {
        this.source = source;
        this.end = source.length;
        this.index = 0;
        this.tokens = [];
        var eater;
        var eaterIndex;
        var currentSourceIndex;
        while (this.index < this.end) {
            currentSourceIndex = this.index;
            for (eaterIndex = 0; eaterIndex < this.eaters.length; eaterIndex++) {
                eater = this.eaters[eaterIndex];
                eater();
                if (this.index !== currentSourceIndex)
                    break;
            }
            if (this.index === currentSourceIndex) {
                this.fail();
            }
        }
        return this.tokens;
    };
    Context.prototype.is = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arg;
        for (var k = 0; k < args.length; k++) {
            arg = args[k];
            if (this.source.substring(this.index, this.index + arg.length) === arg)
                return true;
        }
        return false;
    };
    Context.prototype.fail = function (msg) {
        if (typeof msg === 'undefined')
            msg = "Invalid char at ".concat(this.index, "!");
        throw { index: this.index, source: this.source, message: msg };
    };
    Context.prototype.eos = function () { return this.index >= this.end; };
    Context.prototype.peek = function () {
        return this.eos() ? null : this.source[this.index];
    };
    Context.prototype.next = function () {
        return this.eos() ? null : this.source[this.index++];
    };
    Context.prototype.back = function () {
        if (this.index > 0)
            this.index--;
    };
    Context.prototype.addToken = function (type, index, value) {
        var tokenIndex;
        var tokenValue;
        if (typeof index === 'undefined') {
            tokenIndex = this.index;
            tokenValue = value;
        }
        else if (typeof index !== 'number') {
            tokenValue = index;
            tokenIndex = this.index;
        }
        else {
            tokenIndex = index;
            tokenValue = value;
        }
        this.tokens.push({
            type: type,
            index: tokenIndex,
            value: tokenValue
        });
    };
    Context.prototype.eatBlanks = function () {
        while (" \t\n\r".indexOf(this.peek() || '') !== -1)
            this.index++;
    };
    Context.prototype.eatSymbol = function () {
        var tkn = null;
        var c = this.peek();
        switch (c) {
            case '{':
                tkn = types_1.TokenType.OBJ_OPEN;
                break;
            case '}':
                tkn = types_1.TokenType.OBJ_CLOSE;
                break;
            case '[':
                tkn = types_1.TokenType.ARR_OPEN;
                break;
            case ']':
                tkn = types_1.TokenType.ARR_CLOSE;
                break;
            case ':':
                tkn = types_1.TokenType.COLON;
                break;
        }
        if (c === ',') {
            this.index++;
            return;
        }
        if (tkn !== null) {
            this.addToken(tkn);
            this.index++;
        }
    };
    Context.prototype.eatComment = function () {
        var savedIndex = this.index;
        if (this.peek() !== '/')
            return;
        this.index++;
        var c = this.next();
        if (c === '/') {
            var endOfSingleComment = this.source.indexOf('\n', this.index);
            if (endOfSingleComment === -1) {
                this.index = this.end;
            }
            else {
                this.index = endOfSingleComment + 1;
            }
        }
        else if (c === '*') {
            var endOfComment = this.source.indexOf('*/', this.index);
            if (endOfComment === -1) {
                this.index = this.end;
            }
            else {
                this.index = endOfComment + 2; // +2 to skip '*/'
            }
        }
        else {
            this.index = savedIndex;
        }
    };
    Context.prototype.eatMultilineString = function () {
        if (!this.is('```'))
            return;
        var start = this.index;
        this.index += 3;
        var endOfMultiline = this.source.indexOf('```', this.index);
        if (endOfMultiline === -1) {
            this.index = start;
            this.fail("Missing end of multiline string");
        }
        var str = this.source.substring(start + 3, endOfMultiline);
        this.addToken(types_1.TokenType.STRING, start, str);
        this.index = endOfMultiline + 3;
    };
    Context.prototype.eatString = function () {
        var quote = this.peek();
        if (quote !== '"' && quote !== "'")
            return;
        var start = this.index;
        this.index++;
        var escape = false;
        var str = '';
        var c;
        while (!this.eos()) {
            c = this.next();
            if (c === null)
                break; // Should not happen if !this.eos()
            if (escape) {
                escape = false;
                if (c === 'n')
                    c = '\n';
                else if (c === 'r')
                    c = '\r';
                else if (c === 't')
                    c = '\t';
                str += c;
            }
            else if (c === "\\") {
                escape = true;
            }
            else if (c === quote) {
                this.addToken(types_1.TokenType.STRING, start, str);
                return;
            }
            else {
                str += c;
            }
        }
        this.index = start;
        this.fail("Missing end of string");
    };
    Context.prototype.eatIdentifier = function () {
        var start = this.index;
        var c = this.peek();
        if (c === null || " \t\n\r,:[]{}".indexOf(c) !== -1 || this.is("//", "/*"))
            return;
        this.index++;
        var str = c;
        while (!this.eos()) {
            c = this.peek();
            if (c === null || " \t\n\r,:[]{}".indexOf(c) !== -1 || this.is("//", "/*"))
                break;
            str += c;
            this.index++;
        }
        if (this.RX_DECIMAL.test(str)) {
            this.addToken(types_1.TokenType.NUMBER, start, parseFloat(str));
        }
        else if (this.RX_HEXA.test(str)) {
            this.addToken(types_1.TokenType.NUMBER, start, parseInt(str, 16));
        }
        else if (this.RX_OCTAL.test(str)) {
            if (str.charAt(0) === '-') {
                str = "-" + str.substring(3);
            }
            else {
                str = str.substring(2);
            }
            this.addToken(types_1.TokenType.NUMBER, start, parseInt(str, 8));
        }
        else if (this.RX_BINARY.test(str)) {
            if (str.charAt(0) === '-') {
                str = "-" + str.substring(3);
            }
            else {
                str = str.substring(2);
            }
            this.addToken(types_1.TokenType.NUMBER, start, parseInt(str, 2));
        }
        else {
            var type = types_1.TokenType.SPECIAL;
            var value = str;
            if (str === 'null')
                value = null;
            else if (str === 'undefined')
                value = undefined;
            else if (str === 'true')
                value = true;
            else if (str === 'false')
                value = false;
            else
                type = types_1.TokenType.STRING;
            this.addToken(type, start, value);
        }
    };
    return Context;
}());
exports.Tokenizer = {
    OBJ_OPEN: types_1.TokenType.OBJ_OPEN,
    OBJ_CLOSE: types_1.TokenType.OBJ_CLOSE,
    ARR_OPEN: types_1.TokenType.ARR_OPEN,
    ARR_CLOSE: types_1.TokenType.ARR_CLOSE,
    STRING: types_1.TokenType.STRING,
    NUMBER: types_1.TokenType.NUMBER,
    SPECIAL: types_1.TokenType.SPECIAL,
    COLON: types_1.TokenType.COLON,
    tokenize: function (source) {
        var ctx = new Context();
        return ctx.tokenize(source);
    },
    getTypeName: function (type) { return TYPE_NAMES[type]; }
};
