// src/functions/httpTrigger.ts
const functions = require("@azure/functions");

functions.app.http("trigger", {
  methods: [
    "GET",
    "POST",
    "DELETE",
    "PUT"
  ],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: async (req, ctx) => {
    return { body: `Hello!` };
  }
});
