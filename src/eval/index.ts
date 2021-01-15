import { isNumber } from "../common/is";
import { NodeKind } from "../common/node";
import { lookup } from "./env";
import { createFunc } from "./function";

export function letEval() {
  const env = [{}];

  return function (ast) {
    return theEval(ast, env);
  };

  function theEval(ast, env) {
    const { nodeKind, value } = ast;

    switch (nodeKind) {
      case NodeKind.Atom:
        return evalAtom(value, env);

      case NodeKind.List:
        return evalList(value, env);

      case NodeKind.Program:
        return evalProgram(value, env);
    }
  }

  function evalAtom(value, env) {
    const { text } = value;
    if (isNumber(text)) {
      return +text;
    }

    return lookup(text, env);
  }

  function evalList(value, env) {
    const [operator] = value;

    switch (operator.value.text) {
      case 'define':
        return evalDefine(value, env);

      case 'lambda':
        return evalLambda(value, env);

      case 'add':
        return evalAdd(value, env);

      case 'display':
        return evalDisplay(value, env);

      default:
        return evalFuncApply(value, env);
    }
  }

  function evalAdd(value, env) {
    const [, ...exprs] = value;
    return exprs.reduce((memo, expr) => memo + theEval(expr, env), 0);
  }

  function evalDefine(value, env) {
    const [, name, expr] = value;
    const [globalFrame] = env;
    globalFrame[name.value.text] = theEval(expr, env);
  }

  function evalLambda(value, env) {
    const [, paramList, body] = value;

    if (!process.env.lexical) {
      return createFunc(paramList, body);
    }

    // 将 lambda 定义时的环境保存下来
    const funcDefEnv = JSON.stringify(env);
    return createFunc(paramList, body, funcDefEnv);
  }

  function evalDisplay(value, env) {
    const [, expr] = value;
    console.log(theEval(expr, env));
  }

  function evalProgram(value, env) {
    value.forEach(expr => theEval(expr, env));
  }

  function evalFuncApply(value, env) {
    const [funcName, ...funcArgs] = value;
    const afterEvalFuncArgs = funcArgs.map(expr => theEval(expr, env));

    const { paramList, body, env: funcDefEnv } = lookup(funcName.value.text, env);

    const frame = {};
    paramList.value.forEach((param, index) => {
      frame[param.value.text] = afterEvalFuncArgs[index];
    });

    // 函数调用的求值环境
    const funcEvalEnv = !process.env.lexical
      // 动态作用域：全局环境
      ? env
      // 词法作用域：函数定义时的环境
      : JSON.parse(funcDefEnv);

    funcEvalEnv.push(frame);
    const funcReturn = evalList(body.value, funcEvalEnv);
    funcEvalEnv.pop(frame);

    return funcReturn;
  }
};
