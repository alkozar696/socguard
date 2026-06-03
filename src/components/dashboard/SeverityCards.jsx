import React from 'react';
import { SEVERITY_CONFIG } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function SeverityCards({ events }) {
  const counts = {
    Critical: events.filter(e => e.severity === 'Critical').length,
    High: events.filter(e => e.severity === 'High').length,
    Medium: events.filter(e => e.severity === 'Medium').length,
    Low: events.filter(e => e.severity === 'Low').length,
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(counts).map(([severity, count]) => (
        <div key={severity} className={cn(
          "rounded-xl border p-4 text-center transition-all",
          SEVERITY_CONFIG[severity].color
        )}>
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-xs font-medium mt-1">{severity}</div>
        </div>
      ))}
    </div>
  );
}