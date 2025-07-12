export enum TokenType {
  UNKNOWN,
  OBJ_OPEN, OBJ_CLOSE, ARR_OPEN, ARR_CLOSE,
  STRING, NUMBER, SPECIAL, COLON,
  NEWLINE, // Added for Luciform parsing
  ACTION_START, // Added for Luciform parsing
  PAS_SEPARATOR, // Added for Luciform parsing
  LUCIFORM_SYGIL, // Added for Luciform parsing
  LEGACY_COMMAND, // Added for Luciform parsing
  EOF // Added for end of file
}

export interface Token {
  type: TokenType;
  index: number;
  value: any;
  line?: number;
  column?: number;
}
