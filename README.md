### tiny-language

```
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
```
