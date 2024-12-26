import type { HttpRequest, InvocationContext } from "@azure/functions";
import { newRequestFromAzureFunctions } from "./request";
import { newAzureFunctionsResponse } from "./response";
import { interceptor } from "./log";

export type FetchCallback = (
  request: Request,
  env: Record<string, unknown>
) => Promise<Response> | Response;

export function azureHonoHandler(fetch: FetchCallback) {
  return async (request: HttpRequest, context: InvocationContext) => {
    interceptor(context);
    return newAzureFunctionsResponse(
      await fetch(newRequestFromAzureFunctions(request), process.env)
    );
  };
}
