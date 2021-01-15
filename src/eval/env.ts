export function lookup(name, env) {
  for (let i = env.length - 1; i >= 0; i--) {
    const frame = env[i];
    const value = frame[name];
    if (value != null) {
      return value;
    }
  }

  debugger
  throw new Error(`Can't find name: ${name} in the env ${JSON.stringify(env, null, 2)}`);
}
