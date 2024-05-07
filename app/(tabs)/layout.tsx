import TabBar from "@/components/tab-bar";
import React from "react";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="px-6 py-8">{children}</div>
      <TabBar />
    </div>
  );
}
