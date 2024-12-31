"use client";

import { useState } from "react";
import { getTime } from "./actions";

export default function Home() {
  const [res, setRes] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold py-4">Hello world!</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        onClick={async () => {
          const { time } = await getTime();
          setRes(time);
        }}
      >
        Get time from server action
      </button>
      <span>{res !== null && <p>Server time: {res}</p>}</span>
    </div>
  );
}
