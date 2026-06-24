import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  label: string;
  icon: ReactNode;
  value: string;
  sub: string;
}

export function MetricsCard({ label, icon, value, sub }: MetricsCardProps) {
  return (
    <Card className="rounded-md border">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl tracking-tight">{value}</p>
        <p className="truncate text-muted-foreground text-xs">{sub}</p>
      </CardContent>
    </Card>
  );
}
