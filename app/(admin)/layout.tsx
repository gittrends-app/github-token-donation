import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type * as React from "react";
import { authOptions } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return <>{children}</>;
}
