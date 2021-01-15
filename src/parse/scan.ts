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

export function isIdentifierStart(ch) {
  return (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9');
}

function isIdentifierPart(ch) {
  return isIdentifierStart(ch) || ch === '-';
}
