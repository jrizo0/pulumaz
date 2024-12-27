import { readdirSync } from "fs";

export const outputs = {};

for (const value of readdirSync("./src/")) {
  const result = require("./src/" + value);
  if (result.outputs) Object.assign(outputs, result.outputs);
}
