export enum TokenKind {
  LeftBracket = 'LeftBracket',
  RightBracket = 'RightBracket',
  Identifier = 'Identifier',
  EndOfFile = 'EndOfFile',
}

export interface Token {
  tokenKind: TokenKind;
  start: number;
  end: number;
  text: string;
}

export function createToken(tokenKind: TokenKind, start: number, end: number, text: string): Token {
  return {
    tokenKind,
    start,
    end,
    text,
  };
}
