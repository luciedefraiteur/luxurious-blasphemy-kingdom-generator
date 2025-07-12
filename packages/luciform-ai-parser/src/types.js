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
    TokenType[TokenType["NEWLINE"] = 9] = "NEWLINE";
    TokenType[TokenType["ACTION_START"] = 10] = "ACTION_START";
    TokenType[TokenType["PAS_SEPARATOR"] = 11] = "PAS_SEPARATOR";
    TokenType[TokenType["LUCIFORM_SYGIL"] = 12] = "LUCIFORM_SYGIL";
    TokenType[TokenType["LEGACY_COMMAND"] = 13] = "LEGACY_COMMAND";
    TokenType[TokenType["EOF"] = 14] = "EOF"; // Added for end of file
})(TokenType || (exports.TokenType = TokenType = {}));
