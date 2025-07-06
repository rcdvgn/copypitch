import React from "react";

export default function CreateTemplate({ data, closeItself }: any) {
  return (
    <div
      onClick={closeItself}
      className="h-[50vh] w-[50vw] bg-red-500 text-white"
    >
      {data}
    </div>
  );
}
