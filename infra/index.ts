import { readdirSync } from "fs";

const outputs = {};

for (const value of readdirSync("./infra/")) {
  const result = require("./infra/" + value);
  if (result.outputs) Object.assign(outputs, result.outputs);
}

export { outputs };
