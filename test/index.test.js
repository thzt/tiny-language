const assert = require('assert');
const { letParse, letEval } = require('../out');

describe('tiny-language', () => {
  describe('parse', () => {
    it('Atom', async () => {
      const code = `a`;
      const ast = letParse()(code);
      debugger
    });

    it('List', async () => {
      const code = `(a)`;
      const ast = letParse()(code);
      debugger
    });

    it('Expr', async () => {
      const code = `(a (b))`;
      const ast = letParse()(code);
      debugger
    });

    it('Program', async () => {
      const code = `
        (define f (lambda (x) (add x 1)))
        (display (f 2))
      `;
      const ast = letParse()(code);
      debugger
    });
  });

  describe('eval', () => {
    it('dynamic eval', async () => {
      const code = `
        (define f (lambda (x) (lambda (y) (add x y))))
        (define g (f 1))
        (define x 100)
        (display (g 2))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('lexical eval', async () => {
      process.env.lexical = '1';

      const code = `
      (define f (lambda (x)
        (lambda (y) (add x y))))

      (define g (f 1))
      (define x 100)
      (display (g 2))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('lexical eval: another', async () => {
      process.env.lexical = '1';

      const code = `
      (define f (lambda (x)
        (lambda (y)
          (lambda (z) (add x y z)))))

      (define gx1 (f 1))
      (define gx2 (f 2))

      (define hx1y3 (gx1 3))
      (define hx2y4 (gx2 4))

      (display (hx1y3 5))
      (display (hx1y3 6))

      (display (hx2y4 7))
      (display (hx2y4 8))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });
  });
});
