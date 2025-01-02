import { Hono } from "hono";
import { logger } from "hono/logger";
import { Example } from "@pulumaz/core/example/index";

export const api = new Hono()
  .use(logger())
  .get("/", (c) => {
    console.log("Hello from console.log");
    return c.text("Hello Azure Functions!");
  })
  .get("/helloworld", (c) => c.text("Hello world"))
  .get("/core", (c) => c.text("From core package:" + Example.hello()))
  .get("/list", async (c) => {
    const list = await Example.list();
    return c.json(list);
  })
  .get("/error", (c) => {
    console.log("We're going to throw an error");
    throw new Error("mock error");
  });
