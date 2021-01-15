/**
 * 扫描一个标识符
 */
export function scanIdentifier(sourceCode, pos, length) {
  ++pos;

  while (true) {
    if (pos >= length) {
      break;
    }
    const ch = sourceCode.charAt(pos);
    if (!isIdentifierPart(ch)) {
      break;
    }
    ++pos;
  }

  return pos;
}

/**
 * 是标识符的开头
 */
export function isIdentifierStart(ch) {
  return (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9');
}

/**
 * 是标识符的一部分
 */
function isIdentifierPart(ch) {
  return isIdentifierStart(ch) || ch === '-';
}
