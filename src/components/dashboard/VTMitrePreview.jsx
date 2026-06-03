import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, ArrowLeft } from 'lucide-react';
import { virusTotalDemoResults, mitreAttackData } from '@/lib/demoData';
import { Badge } from '@/components/ui/badge';

export default function VTMitrePreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* VirusTotal */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">תוצאות VirusTotal אחרונות</h3>
          </div>
          <Link to="/virustotal" className="text-xs text-primary hover:underline flex items-center gap-1">
            הצג הכל <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {virusTotalDemoResults.slice(0, 3).map((r, i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground truncate max-w-[200px]">{r.query}</p>
                <p className="text-[10px] text-muted-foreground">{r.type} · {r.threat}</p>
              </div>
              <Badge className={r.risk === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}>
                {r.score}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* MITRE */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">טכניקות MITRE ATT&CK</h3>
          </div>
          <Link to="/mitre" className="text-xs text-primary hover:underline flex items-center gap-1">
            הצג הכל <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {mitreAttackData.techniques.slice(0, 4).map(t => (
            <div key={t.id} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.id} · {t.tactic}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{t.relevance}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}