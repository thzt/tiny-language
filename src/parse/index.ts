import { createNode, Node, NodeKind } from "./node";
import { createToken, Token, TokenKind } from "./token";
import { isIdentifierStart, scanIdentifier } from "./scan";
import { assert } from "./assert";

export const letParse = () => {
  let sourceCode: string;
  let length: number;
  let pos: number;
  let token: Token;

  return parse;

  // ---- ---- ---- ---- ---- ---- ---- ---- ----

  /**
   * syntax
   * 
   * Expr = Atom | List
   * Atom = Identifier
   * List = '(' Exprs ')'
   * Exprs = Expr Exprs
   */
  function parse(code): Node {
    sourceCode = code;
    length = sourceCode.length;
    pos = 0;

    nextToken();
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);
    const exprNode = parseExpr();

    nextToken();
    assert(token, [TokenKind.EndOfFile]);

    return exprNode;
  }

  /**
   * Expr = Atom | List
   */
  function parseExpr() {
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);

    if (token.tokenKind === TokenKind.Identifier) {
      return createNode(NodeKind.Atom, token);
    }

    assert(token, [TokenKind.LeftBracket]);
    const listNode = parseList();
    return listNode;
  }

  /**
   * List = '(' Exprs ')'
   */
  function parseList() {
    assert(token, [TokenKind.LeftBracket]);

    const exprNodes = parseExprs();
    return createNode(NodeKind.List, exprNodes);
  }

  /**
   * Exprs = Expr Exprs
   */
  function parseExprs(): Node[] {
    const exprNodes = [];
    while (true) {
      nextToken();
      assert(token, [TokenKind.RightBracket, TokenKind.Identifier, TokenKind.LeftBracket]);

      // 遇到右括号，说明当前层级的 Exprs 处理完毕
      if (token.tokenKind === TokenKind.RightBracket) {
        break;
      }

      assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);
      const exprNode = parseExpr();
      exprNodes.push(exprNode);
    }

    return exprNodes;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ----

  /**
   * 向后扫描一个 token
   */
  function nextToken() {
    while (true) {
      if (pos >= length) {
        return token = createToken(TokenKind.EndOfFile, pos, pos, null);
      }

      const ch = sourceCode.charAt(pos);
      switch (ch) {
        case '(':
          return token = createToken(TokenKind.LeftBracket, pos, ++pos, ch);
        case ')':
          return token = createToken(TokenKind.RightBracket, pos, ++pos, ch);

        case ' ':
        case '\n':
          ++pos;
          continue;

        default:
          if (isIdentifierStart(ch)) {
            const end = scanIdentifier(sourceCode, pos, length);
            const text = sourceCode.slice(pos, end);
            return token = createToken(TokenKind.Identifier, pos, (pos = end), text);
          }
      }
    }
  }
};
