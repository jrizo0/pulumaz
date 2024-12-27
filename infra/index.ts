import { readdirSync } from "fs";

const files = readdirSync("./src/");

for (const value of files) {
  const result = require("./src/" + value);
  if (result.outputs) {
    for (const [key, val] of Object.entries(result.outputs)) {
      exports[key] = val;
    }
  }
}
