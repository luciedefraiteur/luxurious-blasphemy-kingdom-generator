export declare enum TokenType {
    UNKNOWN = 0,
    OBJ_OPEN = 1,
    OBJ_CLOSE = 2,
    ARR_OPEN = 3,
    ARR_CLOSE = 4,
    STRING = 5,
    NUMBER = 6,
    SPECIAL = 7,
    COLON = 8,
    NEWLINE = 9,// Added for Luciform parsing
    ACTION_START = 10,// Added for Luciform parsing
    PAS_SEPARATOR = 11,// Added for Luciform parsing
    LUCIFORM_SYGIL = 12,// Added for Luciform parsing
    LEGACY_COMMAND = 13,// Added for Luciform parsing
    EOF = 14
}
export interface Token {
    type: TokenType;
    index: number;
    value: any;
    line?: number;
    column?: number;
}
