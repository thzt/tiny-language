const assert = require('assert');
const { parse, _eval } = require('../out');

describe('tiny-language', () => {
  const code = '';

  describe('parse', () => {
    it('success', async () => {
      const ast = parse(code);
      assert(true);
      debugger
    });
  });

  describe('eval', () => {
    it('success', async () => {
      _eval();
      assert(true);
      debugger;
    });
  });
});
