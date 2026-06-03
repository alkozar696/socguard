import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={cn("text-3xl font-bold mt-2", color || "text-foreground")}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors")}>
            <Icon className={cn("w-5 h-5", color || "text-muted-foreground")} />
          </div>
        )}
      </div>
    </div>
  );
}