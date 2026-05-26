import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = getSession();
  if (!user) redirect("/auth/login");

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Sidebar user={user} />
        <div>{children}</div>
      </div>
    </section>
  );
}
