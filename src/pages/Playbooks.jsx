import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, Zap, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { playbooks, SEVERITY_CONFIG } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const stepTypeConfig = {
  trigger: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'טריגר' },
  investigation: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'חקירה' },
  containment: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'הכלה' },
  response: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'תגובה' },
  closure: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'סגירה' },
};

export default function Playbooks() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Playbooks</h1>
          <p className="text-sm text-muted-foreground mt-1">{playbooks.length} תהליכי תגובה מוגדרים</p>
        </div>
      </div>

      <div className="space-y-4">
        {playbooks.map(pb => {
          const isExpanded = expandedId === pb.id;
          return (
            <div key={pb.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div 
                className="p-5 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : pb.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{pb.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{pb.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={cn(SEVERITY_CONFIG[pb.severity].badge, 'text-[10px]')}>{pb.severity}</Badge>
                    <Badge variant="outline" className="text-[10px]">{pb.detectionSource}</Badge>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">{pb.executions} הפעלות</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Info grid */}
                  <div className="grid grid-cols-4 gap-4 p-5 bg-secondary/20">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Trigger</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{pb.trigger}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">חומרה</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{pb.severity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">מקור זיהוי</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{pb.detectionSource}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">הפעלה אחרונה</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{new Date(pb.lastRun).toLocaleString('he-IL')}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="p-5">
                    <h4 className="text-sm font-semibold text-foreground mb-4">שלבי טיפול</h4>
                    <div className="space-y-0">
                      {pb.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-secondary border-2 border-border flex items-center justify-center z-10">
                              <span className="text-[10px] font-bold text-muted-foreground">{step.order}</span>
                            </div>
                            {i < pb.steps.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                          </div>
                          <div className="pb-4 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">{step.title}</span>
                              <Badge className={cn("text-[10px]", stepTypeConfig[step.type].color)}>{stepTypeConfig[step.type].label}</Badge>
                              {step.auto && <Badge variant="outline" className="text-[10px] text-primary border-primary/30"><Zap className="w-2.5 h-2.5 mr-1" />SOAR אוטומטי</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escalation & Closure */}
                  <div className="grid grid-cols-2 gap-4 p-5 border-t border-border bg-secondary/10">
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-semibold text-orange-400">תנאי הסלמה</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{pb.escalation}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs font-semibold text-green-400">תנאי סגירה</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{pb.closureCondition}</p>
                    </div>
                  </div>

                  {/* Run button */}
                  <div className="p-4 border-t border-border flex justify-end">
                    <Button className="gap-2" onClick={() => toast.success(`Playbook "${pb.name}" הופעל בהצלחה`)}>
                      <Play className="w-4 h-4" /> הפעל Playbook
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}