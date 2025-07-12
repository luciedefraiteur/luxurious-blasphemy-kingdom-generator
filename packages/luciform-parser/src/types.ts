export enum TokenType {
  UNKNOWN,
  OBJ_OPEN, OBJ_CLOSE, ARR_OPEN, ARR_CLOSE,
  STRING, NUMBER, SPECIAL, COLON
}

export interface Token {
  type: TokenType;
  index: number;
  value: any;
}
