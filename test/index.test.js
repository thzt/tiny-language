const assert = require('assert');
const { letParse, letEval } = require('../out');

describe('tiny-language', () => {
  describe('parse', () => {
    it('Atom', async () => {
      const code = `a`;
      const ast = letParse()(code);

      assert(ast.nodeKind === 'Atom');

      assert(ast.value.tokenKind === 'Identifier');
      assert(ast.value.text === 'a');

      debugger
    });

    it('List', async () => {
      const code = `(a)`;
      const ast = letParse()(code);

      assert(ast.nodeKind === 'List');
      assert(ast.value[0].nodeKind === 'Atom');

      assert(ast.value[0].value.tokenKind === 'Identifier');
      assert(ast.value[0].value.text === 'a');

      debugger
    });

    it.only('Expr', async () => {
      const code = `(a (b))`;
      const ast = letParse()(code);

      assert(ast.nodeKind === 'List');
      assert(ast.value[0].nodeKind === 'Atom');
      assert(ast.value[0].value.tokenKind === 'Identifier');
      assert(ast.value[0].value.text === 'a');

      assert(ast.value[1].nodeKind === 'List');
      assert(ast.value[1].value[0].nodeKind === 'Atom');
      assert(ast.value[1].value[0].value.tokenKind === 'Identifier');
      assert(ast.value[1].value[0].value.text === 'b');

      debugger
    });
  });

  describe('eval', () => {
    it('success', async () => {
      letEval();
      assert(true);
      debugger;
    });
  });
});
