import { isNumber, isSpecialOperator } from "../common/is";
import { NodeKind } from "../common/node";
import { lookup } from "./env";
import { createFunc } from "./function";

/**
 * 根据 process.env.lexical 环境变量可分为两种 eval 模式：
 * 默认为动态作用域，设置 process.env.lexical 为真值之后，切换成词法作用域
 */
export function letEval() {
  const env = [{}];

  return function (ast) {
    return theEval(ast, env);
  };

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  function theEval(ast, env) {
    const { nodeKind, value } = ast;

    switch (nodeKind) {
      case NodeKind.Atom:
        return evalAtom(value, env);

      case NodeKind.List:
        return evalList(value, env);

      default:
        throw new Error(`unexpected node kind: ${nodeKind}`);
    }
  }

  function evalAtom(value, env) {
    const { text } = value;
    if (isNumber(text)) {
      return +text;
    }

    return lookup(text, env);
  }

  /**
   * 列表：要么是一个特殊算符调用，要么是一个函数调用
   */
  function evalList(value, env) {
    const [operator] = value;
    const operatorName = operator.value.text;

    // 优先处理语言内置的算符
    if (isSpecialOperator(operatorName)) {
      return evalSpecial(operator.value.text, value, env);
    }

    // 第一个元素如果是一个列表，就先求值
    if (operator.nodeKind === NodeKind.List) {
      const [, ...funcArgs] = value;
      const func = theEval(operator, env);
      return evalFuncApply(func, funcArgs, env);
    }

    // 否则直接根据函数名查出
    const [funcName, ...funcArgs] = value;
    const func = lookup(funcName.value.text, env);
    return evalFuncApply(func, funcArgs, env);
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  function evalSpecial(operatorName, value, env) {
    switch (operatorName) {

      // 执行程序必须的几个特殊算符
      case 'begin':  // 顺序执行，返回最后一个表达式的值
        return evalBegin(value, env);
      case 'lambda':  // 定义函数
        return evalLambda(value, env);
      case 'display':  // 显示结果
        return evalDisplay(value, env);
      case 'define':  // 定义变量
        return evalDefine(value, env);

      case 'if':  // 条件判断
        return evalIf(value, env);
      case 'equal':  // 相等性判断
        return evalEqual(value, env);

      case 'add':  // 加法
        return evalAdd(value, env);
      case 'mul':  // 乘法
        return evalMul(value, env);
      case 'sub':  // 减法
        return evalSub(value, env);

      default:
        throw new Error(`unimplement special form: ${operatorName}`);
    }
  }

  function evalBegin(value, env) {
    const [, ...exprs] = value;
    const afterEvalExprs = exprs.map(expr => theEval(expr, env));
    return afterEvalExprs.pop();
  }

  function evalLambda(value, env) {
    const [, paramList, body] = value;

    // 动态作用域不用将函数定义时的环境保存下来
    if (!process.env.lexical) {
      return createFunc(paramList, body);
    }

    // 词法作用域：将 lambda 定义时的环境保存下来
    const funcDefEnv = JSON.stringify(env);
    return createFunc(paramList, body, funcDefEnv);
  }

  function evalDisplay(value, env) {
    const [, expr] = value;
    const afterEvalExpr = theEval(expr, env);
    console.log(afterEvalExpr);
  }

  function evalDefine(value, env) {
    const [, name, expr] = value;
    const nearestFrame = env[env.length - 1];
    nearestFrame[name.value.text] = theEval(expr, env);
  }

  // ---- ---- ---- ---- ---- ---- ----

  function evalIf(value, env) {
    const [, condition, thenExpr, elseExpr] = value;
    const afterEvalCondition = theEval(condition, env);
    if (afterEvalCondition) {
      return theEval(thenExpr, env);
    }
    return theEval(elseExpr, env);
  }

  function evalEqual(value, env) {
    const [, expr1, expr2] = value;
    return theEval(expr1, env) === theEval(expr2, env);
  }

  // ---- ---- ---- ---- ---- ---- ----

  function evalAdd(value, env) {
    const [, ...exprs] = value;
    return exprs.reduce((memo, expr) => {
      const afterEvalExpr = theEval(expr, env);
      return memo + afterEvalExpr;
    }, 0);
  }

  function evalMul(value, env) {
    const [, ...exprs] = value;
    return exprs.reduce((memo, expr) => memo * theEval(expr, env), 1);
  }

  function evalSub(value, env) {
    const [, ...exprs] = value;
    const head = exprs.shift();
    return exprs.reduce((memo, expr) => memo - theEval(expr, env), theEval(head, env));
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  function evalFuncApply(func, funcArgs, env) {
    const { paramList, body, env: funcDefEnv } = func;
    const afterEvalFuncArgs = funcArgs.map(expr => theEval(expr, env));

    const frame = {};
    paramList.value.forEach((param, index) => {
      frame[param.value.text] = afterEvalFuncArgs[index];
    });

    // 确定函数调用时的求值环境
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
