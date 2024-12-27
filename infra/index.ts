import { readdirSync } from "fs";

const outputs = {};

for (const value of readdirSync("./src/")) {
  const result = require("./src/" + value);
  if (result.outputs) Object.assign(outputs, result.outputs);
}

export { outputs };
