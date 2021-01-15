export function createFunc(paramList, body, env?) {
  return {
    paramList,
    body,
    env,
  };
}