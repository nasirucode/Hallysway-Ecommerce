"use client";

import { Receipt, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { StatCard } from "./StatCard";

interface Props {
  ordersCount: number;
  invoicesCount: number;
  totalSpent: string;
  outstanding: string;
}

export function DashboardStats({ ordersCount, invoicesCount, totalSpent, outstanding }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Orders placed" value={ordersCount} icon={ShoppingBag} accent="navy" delay={0} />
      <StatCard label="Invoices" value={invoicesCount} icon={Receipt} accent="red" delay={0.05} />
      <StatCard label="Lifetime spend" value={totalSpent} icon={Wallet} accent="tea" delay={0.1} />
      <StatCard label="Outstanding" value={outstanding} icon={Sparkles} accent="gold" delay={0.15} />
    </div>
  );
}
