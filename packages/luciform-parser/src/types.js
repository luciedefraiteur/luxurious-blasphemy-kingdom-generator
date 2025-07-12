"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["UNKNOWN"] = 0] = "UNKNOWN";
    TokenType[TokenType["OBJ_OPEN"] = 1] = "OBJ_OPEN";
    TokenType[TokenType["OBJ_CLOSE"] = 2] = "OBJ_CLOSE";
    TokenType[TokenType["ARR_OPEN"] = 3] = "ARR_OPEN";
    TokenType[TokenType["ARR_CLOSE"] = 4] = "ARR_CLOSE";
    TokenType[TokenType["STRING"] = 5] = "STRING";
    TokenType[TokenType["NUMBER"] = 6] = "NUMBER";
    TokenType[TokenType["SPECIAL"] = 7] = "SPECIAL";
    TokenType[TokenType["COLON"] = 8] = "COLON";
})(TokenType || (exports.TokenType = TokenType = {}));
