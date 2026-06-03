import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Play, Search, Shield, AlertTriangle, XCircle, Clock, FileText, Globe, Hash, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoEvents, SEVERITY_CONFIG, STATUS_CONFIG } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EventDetail() {
  const { id } = useParams();
  const event = demoEvents.find(e => e.id === id);
  const [status, setStatus] = useState(event?.status || 'Open');

  if (!event) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">אירוע לא נמצא</p>
      </div>
    );
  }

  const handleAction = (action) => {
    toast.success(`פעולה בוצעה: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/events">
          <Button variant="ghost" size="icon"><ArrowRight className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{event.title}</h1>
            <Badge className={cn(SEVERITY_CONFIG[event.severity].badge)}>{event.severity}</Badge>
            <Badge className={cn(STATUS_CONFIG[status].color)}>{STATUS_CONFIG[status].label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{event.id} · {event.detectionSource} · {event.assignedAnalyst}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" className="gap-2" onClick={() => handleAction('הפעלת Playbook')}><Play className="w-3.5 h-3.5" /> הפעל Playbook</Button>
        <Button size="sm" variant="secondary" className="gap-2" onClick={() => handleAction('בדיקת VirusTotal')}><Search className="w-3.5 h-3.5" /> בדוק ב-VirusTotal</Button>
        <Button size="sm" variant="secondary" className="gap-2" onClick={() => handleAction('מיפוי MITRE')}><Shield className="w-3.5 h-3.5" /> מפה ל-MITRE ATT&CK</Button>
        <Button size="sm" variant="secondary" className="gap-2 text-orange-400" onClick={() => { handleAction('הסלמה ל-Tier 2'); }}><AlertTriangle className="w-3.5 h-3.5" /> הסלם ל-Tier 2</Button>
        <Button size="sm" variant="secondary" className="gap-2 text-green-400" onClick={() => { setStatus('Closed'); handleAction('סגירת אירוע'); }}><XCircle className="w-3.5 h-3.5" /> סגור אירוע</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">תיאור האירוע</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-[10px] text-muted-foreground">סוג אירוע</p>
                <p className="text-sm font-medium">{event.eventType}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">זמן דיווח</p>
                <p className="text-sm font-medium">{new Date(event.reportedTime).toLocaleString('he-IL')}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">מקור זיהוי</p>
                <p className="text-sm font-medium">{event.detectionSource}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">ציר זמן</h3>
            <div className="space-y-0">
              {event.timeline.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/30 z-10" />
                    {i < event.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">{item.actor}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">ראיות שנאספו</h3>
            <div className="grid grid-cols-2 gap-4">
              {event.evidence.files.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><FileText className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-medium">קבצים</span></div>
                  {event.evidence.files.map((f, i) => <p key={i} className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-2 py-1 mb-1">{f}</p>)}
                </div>
              )}
              {event.evidence.hashes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Hash className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-medium">Hash</span></div>
                  {event.evidence.hashes.map((h, i) => <p key={i} className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-2 py-1 mb-1 truncate">{h}</p>)}
                </div>
              )}
              {event.evidence.ips.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-medium">כתובות IP</span></div>
                  {event.evidence.ips.map((ip, i) => <p key={i} className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-2 py-1 mb-1">{ip}</p>)}
                </div>
              )}
              {event.evidence.urls.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-medium">URLs</span></div>
                  {event.evidence.urls.map((u, i) => <p key={i} className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-2 py-1 mb-1 truncate">{u}</p>)}
                </div>
              )}
              {event.evidence.logs.length > 0 && (
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2"><Terminal className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs font-medium">לוגים</span></div>
                  {event.evidence.logs.map((l, i) => <p key={i} className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-2 py-1 mb-1">{l}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* VT Result */}
          {event.virusTotalResult && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> תוצאת VirusTotal
              </h3>
              <div className="space-y-3">
                <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-2xl font-bold text-red-400">{event.virusTotalResult.score}</p>
                  <p className="text-xs text-muted-foreground">מנועים שזיהו כאיום</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">סוג איום</span>
                    <span className="text-foreground">{event.virusTotalResult.threat}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">המלצה</span>
                    <span className="text-orange-400 font-medium">{event.virusTotalResult.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MITRE Mapping */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> מיפוי MITRE ATT&CK
            </h3>
            <div className="space-y-2">
              {event.mitreMapping.map((m, i) => (
                <div key={i} className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}