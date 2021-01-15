import { createNode, Node, NodeKind } from "../common/node";
import { createToken, Token, TokenKind } from "../common/token";
import { isIdentifierStart, scanIdentifier } from "./scan";
import { assert } from "./assert";

export function letParse() {
  let sourceCode: string;
  let length: number;
  let pos: number;
  let token: Token;

  return parse;
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  /**
   * syntax
   * 
   * Program = Exprs
   * Exprs = Expr Exprs
   * Expr = Atom | List
   * Atom = Identifier
   * List = '(' Exprs ')'
   */
  function parse(code): Node {
    sourceCode = code;
    length = sourceCode.length;
    pos = 0;

    nextToken();
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);
    const programNode = parseProgram();

    assert(token, [TokenKind.EndOfFile]);
    return programNode;
  }

  /**
   * Program = Exprs
   */
  function parseProgram() {
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);

    const exprNodes = parseExprs();
    return createNode(NodeKind.Program, exprNodes);
  }

  /**
   * Exprs = Expr Exprs
   */
  function parseExprs(): Node[] {
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);

    const exprNodes = [];
    while (true) {
      assert(token, [TokenKind.RightBracket, TokenKind.EndOfFile, TokenKind.Identifier, TokenKind.LeftBracket]);

      // 遇到 EOF 说明已处理完
      if (token.tokenKind === TokenKind.EndOfFile) {
        break;
      }

      // 遇到右括号，说明当前层级的 Exprs 处理完毕
      if (token.tokenKind === TokenKind.RightBracket) {
        break;
      }

      assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);
      const exprNode = parseExpr();
      exprNodes.push(exprNode);

      nextToken();
    }

    return exprNodes;
  }

  /**
   * Expr = Atom | List
   */
  function parseExpr() {
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);

    if (token.tokenKind === TokenKind.Identifier) {
      return parseAtom();
    }

    assert(token, [TokenKind.LeftBracket]);
    return parseList();
  }

  function parseAtom() {
    assert(token, [TokenKind.Identifier]);

    return createNode(NodeKind.Atom, token);
  }

  /**
   * List = '(' Exprs ')'
   */
  function parseList() {
    assert(token, [TokenKind.LeftBracket]);

    nextToken();
    assert(token, [TokenKind.Identifier, TokenKind.LeftBracket]);

    const exprNodes = parseExprs();
    return createNode(NodeKind.List, exprNodes);
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

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
