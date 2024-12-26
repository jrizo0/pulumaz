import { InvocationContext } from "@azure/functions";

type LogMethod = "log" | "info" | "warn" | "error";

export function interceptor(context: InvocationContext) {
  const methods = ["log", "info", "warn", "error"];
  //@ts-expect-error
  return methods.forEach((m: LogMethod) => higherOrderLog(m, context));
}

const higherOrderLog = (name: LogMethod, context: InvocationContext) => {
  const logFn = (...params: any[]) => {
    if (context[name]) {
      context[name](...params);
      //@ts-expect-error
    } else if (context.log[name]) {
      // Must check context.log for some methods (currently warn, info, error)
      // @ts-expect-error
      context.log[name](...params);
    }
  };

  console[name] = logFn;
};
