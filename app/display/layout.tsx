import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-orange-500 w-full max-h-screen">{children}</div>;
}
