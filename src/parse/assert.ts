import { Token, TokenKind } from "../common/token";

export function assert(token: Token, tokenKinds: TokenKind[]) {
  if (tokenKinds.includes(token.tokenKind)) {
    return;
  }

  throw new Error(`unexpected token kind: ${JSON.stringify(token, null, 2)}`);
}