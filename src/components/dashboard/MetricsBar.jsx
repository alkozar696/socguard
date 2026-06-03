import React from 'react';
import { Clock, Timer, BookOpen, Shield } from 'lucide-react';

const metrics = [
  { label: 'MTTD (זמן זיהוי ממוצע)', value: '4.2 דקות', icon: Clock, color: 'text-primary' },
  { label: 'MTTR (זמן תגובה ממוצע)', value: '18.5 דקות', icon: Timer, color: 'text-green-400' },
  { label: 'Playbooks פעילים', value: '3/3', icon: BookOpen, color: 'text-orange-400' },
  { label: 'MITRE טכניקות מזוהות', value: '12', icon: Shield, color: 'text-purple-400' },
];

export default function MetricsBar() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <m.icon className={`w-5 h-5 ${m.color} flex-shrink-0`} />
          <div>
            <p className="text-lg font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}