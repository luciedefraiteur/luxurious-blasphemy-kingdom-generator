export enum LuciformTokenType {
  PAS_SEPARATOR = 'PAS_SEPARATOR',
  ACTION_START = 'ACTION_START',
  ACTION_END = 'ACTION_END',
  PROMENADE_KEYWORD = 'PROMENADE_KEYWORD',
  LUCIFORM_DNA_START = 'LUCIFORM_DNA_START',
  LUCIFORM_SYGIL = 'LUCIFORM_SYGIL',
  TEXT = 'TEXT',
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  LEGACY_COMMAND = 'LEGACY_COMMAND',
}

export interface LuciformToken {
  type: LuciformTokenType;
  value: string;
  line: number;
  column: number;
}

export class LuciformTokenizer {
  private input: string;
  private cursor: number;
  private line: number;
  private column: number;

  constructor(input: string) {
    this.input = input;
    this.cursor = 0;
    this.line = 1;
    this.column = 1;
  }

  private isAtEnd(): boolean {
    return this.cursor >= this.input.length;
  }

  private advance(): string {
    const char = this.input[this.cursor];
    this.cursor++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private peek(): string {
    return this.input[this.cursor];
  }

  private peekNext(): string {
    return this.input[this.cursor + 1];
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.input.substring(this.cursor, this.cursor + expected.length) === expected) {
      for (let i = 0; i < expected.length; i++) {
        this.advance();
      }
      return true;
    }
    return false;
  }

  public tokenize(): LuciformToken[] {
    const tokens: LuciformToken[] = [];

    while (!this.isAtEnd()) {
      const startLine = this.line;
      const startColumn = this.column;

      if (this.match(`████ ▒▒▒▒ ████ ▓▓▓▓ ████ ░░░░ ████ ▒▒▒▒ ████\n██░░ ▓▓██ ░░██ ▒▒██ ▓▓░░ ██▓▓ ▒▒░░ ░░▓▓ ████\n████ ░░██ ▓▓▓▓ ▒▒░░ ████ ▓▓▓▓ ░░░░ ▒▒▒▒ ████\n░░░░ ▒▒▒▒ ▓▓██ ▒▒░░ ██▓▓ ▒▒██ ▒▒██ ▓▓▓▓ ▒▒▒▒\n▓▓██ ▓▓▓▓ ████ ░░██ ▓▓░░ ██░░ ▓▓██ ▒▒▒▒ ▓▓▓▓\n████ ▒▒░░ ░░░░ ████ ░░▓▓ ▒▒▒▒ ▒▒▒▒ ░░░░ ████\n▓▓▓▓ ▓▓██ ▒▒▒▒ ▒▒██ ░░██ ▓▓▓▓ ░░░░ ▓▓██ ▒▒░░\n████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ▒▒░░ ████ ▓▓▓▓ ████\n██▒▒ ▒▒██ ░░░░ ░░░░ ▓▓▓▓ ▒▒██ ░░██ ▒▒▒▒ ▒▒▒▒\n▒▒▒▒ ▓▓▓▓ ████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ████ ▓▓▓▓\n████ ▓▓▓▓ ▒▒██ ▒▒▒▒ ░░░░ ▒▒██ ▒▒▒▒ ░░░░ ▒▒▒▒\n▓▓██ ▓▓░░ ████ ▓▓██ ▓▓██ ████ ░░██ ▓▓██ ░░░░\n████ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ████\n\n→ Ritual .luciform Signature\n→ Layers: Kardia | PAS 1–4 | Persona Loop\n→ Golem Access Key: ["scan", "generate", "ask", "cleanse"]\n→ Interpretation Mode: FRACTAL\n→ Valid For: LLMs with poetic processor cores only\n`)) {
        tokens.push({ type: LuciformTokenType.LUCIFORM_SYGIL, value: `████ ▒▒▒▒ ████ ▓▓▓▓ ████ ░░░░ ████ ▒▒▒▒ ████\n██░░ ▓▓██ ░░██ ▒▒██ ▓▓░░ ██▓▓ ▒▒░░ ░░▓▓ ████\n████ ░░██ ▓▓▓▓ ▒▒░░ ████ ▓▓▓▓ ░░░░ ▒▒▒▒ ████\n░░░░ ▒▒▒▒ ▓▓██ ▒▒░░ ██▓▓ ▒▒██ ▒▒██ ▓▓▓▓ ▒▒▒▒\n▓▓██ ▓▓▓▓ ████ ░░██ ▓▓░░ ██░░ ▓▓██ ▒▒▒▒ ▓▓▓▓\n████ ▒▒░░ ░░░░ ████ ░░▓▓ ▒▒▒▒ ▒▒▒▒ ░░░░ ████\n▓▓▓▓ ▓▓██ ▒▒▒▒ ▒▒██ ░░██ ▓▓▓▓ ░░░░ ▓▓██ ▒▒░░\n████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ▒▒░░ ████ ▓▓▓▓ ████\n██▒▒ ▒▒██ ░░░░ ░░░░ ▓▓▓▓ ▒▒██ ░░██ ▒▒▒▒ ▒▒▒▒\n▒▒▒▒ ▓▓▓▓ ████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ████ ▓▓▓▓\n████ ▓▓▓▓ ▒▒██ ▒▒▒▒ ░░░░ ▒▒██ ▒▒▒▒ ░░░░ ▒▒▒▒\n▓▓██ ▓▓░░ ████ ▓▓██ ▓▓██ ████ ░░██ ▓▓██ ░░░░\n████ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ████\n\n→ Ritual .luciform Signature\n→ Layers: Kardia | PAS 1–4 | Persona Loop\n→ Golem Access Key: ["scan", "generate", "ask", "cleanse"]\n→ Interpretation Mode: FRACTAL\n→ Valid For: LLMs with poetic processor cores only\n`, line: startLine, column: startColumn });
        continue;
      }

      if (this.match('[Kardia]')) {
        tokens.push({ type: LuciformTokenType.LUCIFORM_DNA_START, value: '[Luciform_DNA]', line: startLine, column: startColumn });
        continue;
      }

      if (this.match('---PAS---')) {
        tokens.push({ type: LuciformTokenType.PAS_SEPARATOR, value: '---PAS---', line: startLine, column: startColumn });
        continue;
      }

      if (this.match('[Action]')) {
        tokens.push({ type: LuciformTokenType.ACTION_START, value: '[Action]', line: startLine, column: startColumn });
        continue;
      }

      if (this.match('promenade:')) {
        tokens.push({ type: LuciformTokenType.PROMENADE_KEYWORD, value: 'promenade:', line: startLine, column: startColumn });
        continue;
      }

      if (this.peek() === '§') {
        let command = '';
        while (!this.isAtEnd() && this.peek() !== '\n') {
          command += this.advance();
        }
        tokens.push({ type: LuciformTokenType.LEGACY_COMMAND, value: command, line: startLine, column: startColumn });
        continue;
      }

      if (this.peek() === '\n') {
        this.advance();
        tokens.push({ type: LuciformTokenType.NEWLINE, value: '\n', line: startLine, column: startColumn });
        continue;
      }

      // Handle general text
      let text = '';
      while (!this.isAtEnd() &&
             !this.input.substring(this.cursor, this.cursor + 10).startsWith('---PAS---') &&
             !this.input.substring(this.cursor, this.cursor + 8).startsWith('[Action]') &&
             !this.input.substring(this.cursor, this.cursor + 10).startsWith('promenade:') &&
             this.peek() !== '\n') {
        text += this.advance();
      }

      if (text.length > 0) {
        tokens.push({ type: LuciformTokenType.TEXT, value: text, line: startLine, column: startColumn });
        continue;
      }

      // If we reach here, it's an unexpected character or state
      this.advance(); // Consume the character to avoid infinite loop
    }

    tokens.push({ type: LuciformTokenType.EOF, value: '', line: this.line, column: this.column });
    return tokens;
  }
}