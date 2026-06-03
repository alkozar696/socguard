import React, { useState } from 'react';
import { Shield, Users, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mitreAttackData, demoEvents } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const relevanceColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const tacticColors = {
  'Initial Access': 'bg-blue-500/20 text-blue-400',
  'Defense Evasion': 'bg-purple-500/20 text-purple-400',
  'Persistence': 'bg-red-500/20 text-red-400',
  'Impact': 'bg-red-500/20 text-red-400',
  'Execution': 'bg-orange-500/20 text-orange-400',
  'Credential Access': 'bg-yellow-500/20 text-yellow-400',
  'Lateral Movement': 'bg-cyan-500/20 text-cyan-400',
  'Command and Control': 'bg-pink-500/20 text-pink-400',
  'Exfiltration': 'bg-red-500/20 text-red-400',
  'Impair Process Control': 'bg-red-500/20 text-red-400',
};

export default function MitreAttack() {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleAssign = (techniqueId, eventId) => {
    toast.success(`טכניקה ${techniqueId} שויכה לאירוע ${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">MITRE ATT&CK</h1>
        <p className="text-sm text-muted-foreground mt-1">מיפוי טכניקות תקיפה רלוונטיות לתשתיות קריטיות · Energy / ICS</p>
      </div>

      {/* Techniques Grid */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" /> טכניקות רלוונטיות
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mitreAttackData.techniques.map(t => (
            <div key={t.id} className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-primary">{t.id}</span>
                <Badge className={cn("text-[10px]", relevanceColors[t.relevance])}>{t.relevance}</Badge>
              </div>
              <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
              <Badge className={cn("text-[10px] mt-2", tacticColors[t.tactic] || 'bg-secondary')}>{t.tactic}</Badge>
              <p className="text-xs text-muted-foreground mt-2">{t.description}</p>
              
              {/* Assign to event */}
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Select onValueChange={(val) => handleAssign(t.id, val)}>
                  <SelectTrigger className="h-7 text-[10px] flex-1">
                    <SelectValue placeholder="שייך לאירוע..." />
                  </SelectTrigger>
                  <SelectContent>
                    {demoEvents.map(e => (
                      <SelectItem key={e.id} value={e.id} className="text-xs">{e.id} - {e.title.slice(0, 30)}...</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Groups */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-red-400" /> קבוצות תקיפה
        </h3>
        <div className="space-y-3">
          {mitreAttackData.threatGroups.map((group, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <div 
                className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedGroup(expandedGroup === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{group.name}</h4>
                    <p className="text-xs text-muted-foreground">{group.origin} · יעד: {group.target}</p>
                  </div>
                </div>
                {expandedGroup === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
              {expandedGroup === i && (
                <div className="p-4 pt-0 border-t border-border bg-secondary/10">
                  <p className="text-sm text-muted-foreground mb-3 mt-3">{group.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">טכניקות:</span>
                    {group.techniques.map(tid => (
                      <Badge key={tid} variant="outline" className="text-[10px] font-mono">{tid}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}