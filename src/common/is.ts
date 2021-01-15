export function isNumber(n) {
  return n >= '0' && n <= '9';
}

export function isSpecialOperator(name) {
  return [
    'begin', 'lambda', 'display', 'define',
    'if', 'equal',
    'add', 'mul', 'sub',
  ].includes(name);
}
