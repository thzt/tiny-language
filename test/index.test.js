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
        (begin
          (define f (lambda (x) (add x 1)))
          (display (f 2)))
      `;
      const ast = letParse()(code);
      debugger
    });
  });

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  describe('eval', () => {
    it('dynamic eval', async () => {
      const code = `
        (begin
          (define f (lambda (x) (lambda (y) (add x y))))
          (define g (f 1))
          (define x 100)
          (display (g 2)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    /**
      const f = x => {
        return y => {
          return x + y;
        };
      };

      const g = f(1);
      const x = 1;
      console.log(g(2));
     */
    it('lexical eval', async () => {
      process.env.lexical = '1';

      const code = `
        (begin
          (define f (lambda (x)
            (lambda (y) (add x y))))

          (define g (f 1))
          (define x 100)
          (display (g 2)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    /**
      const f = x => {
        return y => {
          return z => {
            return x + y + z;
          };
        };
      };

      const x1 = f(1);
      const x2 = f(2);

      const x1y3 = x1(3);
      const x2y4 = x2(4);

      console.log(x1y3(5));  // 9
      console.log(x1y3(6));  // 10
      console.log(x2y4(7));  // 13
      console.log(x2y4(8));  // 14
     */
    it('lexical eval: another', async () => {
      process.env.lexical = '1';

      const code = `
        (begin
          (define f (lambda (x)
            (lambda (y)
              (lambda (z) (add x y z)))))

          (define x1 (f 1))
          (define x2 (f 2))

          (define x1-y3 (x1 3))
          (define x2-y4 (x2 4))

          (display (x1-y3 5))
          (display (x1-y3 6))

          (display (x2-y4 7))
          (display (x2-y4 8)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('if & equal', async () => {
      process.env.lexical = '1';

      const code = `
        (display (if
          (equal (add 1 2) 3)
          (add 4 5 6)
          7))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('mul & sub', async () => {
      process.env.lexical = '1';

      const code = `
        (begin
          (display (mul 3 2))
          (display (sub 3 2)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('begin', async () => {
      process.env.lexical = '1';

      const code = `
        (display (begin
          (display 1)
          (add 2 3)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    it('func', async () => {
      process.env.lexical = '1';

      const code = `
        (display (
          (lambda (x) (add x 1))
          2))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });

    /**
      const fact = function (n) {
        return n == 0 ? 1 : n * fact(n - 1);
      };

      console.log(fact(5));  // 120
     */

    /**
      const yCombinator = function (k) {
        const f = function (g) {
          return g(g);
        };
      
        const p = function (r) {
          return function (n) {
            return k(r(r))(n);
          };
        };
      
        return f(p);
      };

      const factProto = function (h) {
        return function (x) {
          return x == 0 ? 1 : x * h(x - 1);
        };
      };

      console.log(yCombinator(factProto)(5));  // 120
     */
    it('Y', async () => {
      process.env.lexical = '1';

      const code = `
        (begin
          (define y-combinator (lambda (k) (begin
            (define f (lambda (g)
              (g g)))
            (define p (lambda (r)
              (lambda (n)
                ((k (r r)) n))))
            (f p))))

          (define fact-proto (lambda (h)
            (lambda (x)
              (if (equal x 0) 1 (mul x (h (sub x 1)))))))

          (display ((y-combinator fact-proto) 5)))
      `;
      const ast = letParse()(code);
      letEval()(ast);
      debugger;
    });
  });
});
