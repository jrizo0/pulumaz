import { db } from "../drizzle";
import { exampleTable } from "./example.sql";

export module Example {
  export function hello() {
    return "Hello, world!";
  }
  export function bye() {
    return "Bye, world!";
  }
  export async function list(){
    const res = await db.select().from(exampleTable)
    return res
  }
  export async function create(title: string, content: string) {
    await db.insert(exampleTable).values({
      title,
      content,
    });
  }
}
