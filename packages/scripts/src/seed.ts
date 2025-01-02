import { db } from "@pulumaz/core/drizzle/index";
import { schema } from "@pulumaz/core/drizzle/schema";

async function main() {
  await db.delete(schema.exampleTable);
  console.log("Deleted all examples.");

  await db.insert(schema.exampleTable).values({
    title: "Hello World",
    content: "This is a test.",
  });

  console.log("New example created!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
