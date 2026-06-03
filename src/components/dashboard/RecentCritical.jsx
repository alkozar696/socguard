import React from 'react';
import { Link } from 'react-router-dom';
import { SEVERITY_CONFIG, STATUS_CONFIG } from '@/lib/demoData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

export default function RecentCritical({ events }) {
  const critical = events.filter(e => e.severity === 'Critical' || e.severity === 'High').slice(0, 4);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">אירועים קריטיים אחרונים</h3>
      <div className="space-y-3">
        {critical.map(event => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", SEVERITY_CONFIG[event.severity].dot)} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.id} · {event.detectionSource}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={cn("text-[10px]", SEVERITY_CONFIG[event.severity].badge)}>{event.severity}</Badge>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}