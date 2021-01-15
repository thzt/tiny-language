import { Token, TokenKind } from "../common/token";

/**
  * 断言当前 token 的名字
  */
export function assert(token: Token, tokenKinds: TokenKind[]) {
  if (tokenKinds.includes(token.tokenKind)) {
    return;
  }

  throw new Error(`unexpected token kind: ${JSON.stringify(token, null, 2)}`);
}