// src/functions/httpTrigger.ts
import { app } from "@azure/functions";
import { api } from "../app";
import { azureHonoHandler } from "../hono-adapter";

app.http("httpTrigger", {
  methods: [
    //Add all your supported HTTP methods here
    "GET",
    "POST",
    "DELETE",
    "PUT",
  ],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: azureHonoHandler(api.fetch),
});

export default app;
