import { TokenType, Token } from './types';
export declare const Tokenizer: {
    OBJ_OPEN: TokenType;
    OBJ_CLOSE: TokenType;
    ARR_OPEN: TokenType;
    ARR_CLOSE: TokenType;
    STRING: TokenType;
    NUMBER: TokenType;
    SPECIAL: TokenType;
    COLON: TokenType;
    tokenize: (source: string) => Token[];
    getTypeName: (type: TokenType) => string;
};
