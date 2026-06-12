import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2, XCircle, HelpCircle, Globe, Server, Hash, Link, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

const typeLabels = { files: 'Hash', domains: 'Domain', ip_addresses: 'IP Address', urls: 'URL' };
const typeIcons = { files: Hash, domains: Globe, ip_addresses: Server, urls: Link };

const riskConfig = {
  malicious: { label: 'זדוני', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', badge: 'bg-red-500 text-white', icon: XCircle },
  suspicious: { label: 'חשוד', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', badge: 'bg-orange-500 text-white', icon: AlertTriangle },
  clean: { label: 'נקי', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', badge: 'bg-green-500 text-white', icon: CheckCircle },
  unknown: { label: 'לא ידוע', color: 'text-muted-foreground', bg: 'bg-secondary/30 border-border', badge: 'bg-secondary text-foreground', icon: HelpCircle },
};

const exampleQueries = [
  '8.8.8.8',
  'google.com',
  '44d88612fea8a8f36de82e1278abb02f',
];

export default function VirusTotal() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleCheck = async (rescan = false) => {
    if (!query.trim()) return;
    if (rescan) setRescanning(true);
    else { setLoading(true); setResult(null); }
    setError(null);

    const response = await base44.functions.invoke('virusTotal', { query: query.trim(), rescan });
    const data = response.data;

    setLoading(false);
    setRescanning(false);

    if (data.error && data.error === 'not_found') {
      setError('לא נמצא מידע עבור שאילתה זו ב-VirusTotal');
      return;
    }
    if (data.error) {
      setError(`שגיאה: ${data.message || data.error}`);
      return;
    }

    setResult(data);
    setHistory(prev => [data, ...prev.filter(h => h.query !== data.query)].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">בדיקת VirusTotal</h1>
        <p className="text-sm text-muted-foreground mt-1">בדיקת Hash, IP, דומיין או URL מול מנועי VirusTotal בזמן אמת</p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="הזן Hash, כתובת IP, דומיין או URL..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pr-9 font-mono text-sm"
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
            />
          </div>
          <Button onClick={() => handleCheck(false)} disabled={loading || rescanning || !query.trim()} className="gap-2 min-w-[160px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'בודק...' : 'בדוק ב-VirusTotal'}
          </Button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap items-center">
          <span className="text-xs text-muted-foreground">דוגמאות:</span>
          {exampleQueries.map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-card rounded-xl border border-red-500/30 p-5 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (() => {
        const risk = riskConfig[result.riskLevel] || riskConfig.unknown;
        const RiskIcon = risk.icon;
        const TypeIcon = typeIcons[result.type] || Hash;
        const pct = result.stats.total > 0 ? Math.round((result.stats.malicious / result.stats.total) * 100) : 0;
        return (
          <div className="space-y-4">
            {/* Risk banner */}
            <div className={cn("rounded-xl border p-5 flex items-center gap-4", risk.bg)}>
              <RiskIcon className={cn("w-8 h-8 flex-shrink-0", risk.color)} />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={cn("text-xl font-bold", risk.color)}>{risk.label}</h3>
                  <Badge className={cn("text-xs", risk.badge)}>{typeLabels[result.type] || result.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1 break-all">{result.query}</p>
                {result.lastAnalysisDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ניתוח אחרון: {new Date(result.lastAnalysisDate * 1000).toLocaleString('he-IL')}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className={cn("text-3xl font-bold", risk.color)}>{result.stats.malicious}/{result.stats.total}</p>
                  <p className="text-xs text-muted-foreground">מנועים זיהו כזדוני</p>
                </div>
                {result.canRescan && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCheck(true)}
                    disabled={rescanning}
                    className="gap-2 text-xs"
                  >
                    <RefreshCw className={cn("w-3 h-3", rescanning && "animate-spin")} />
                    {rescanning ? 'מנתח מחדש...' : 'Rescan'}
                  </Button>
                )}
              </div>
            </div>

            {/* Recommendation banner */}
            {(result.riskLevel === 'malicious' || result.riskLevel === 'suspicious') && (() => {
              const recommendations = {
                malicious: {
                  title: 'פעולות מומלצות מיידיות',
                  color: 'border-red-500/40 bg-red-500/10',
                  titleColor: 'text-red-400',
                  actions: [
                    { label: '🚫 חסום בפיירוול', desc: 'הוסף לרשימת חסימה ב-Firewall / NGFW' },
                    { label: '🔒 בודד מארח', desc: 'בצע Network Isolation על המכונה הנגועה' },
                    { label: '🔍 פתח חקירה', desc: 'צור אירוע חדש ב-SIEM ופתח Playbook תגובה' },
                    { label: '📢 הסלם לTier 2', desc: 'העבר לאנליסט Tier 2 לטיפול מיידי' },
                  ]
                },
                suspicious: {
                  title: 'פעולות מומלצות',
                  color: 'border-orange-500/40 bg-orange-500/10',
                  titleColor: 'text-orange-400',
                  actions: [
                    { label: '👁 מעקב מוגבר', desc: 'הפעל ניטור מוגבר על התעבורה הקשורה' },
                    { label: '🔍 ניתוח נוסף', desc: 'שלח לסנדבוקס לניתוח דינמי מעמיק' },
                    { label: '📋 תעד את הממצאים', desc: 'צור רשומת אירוע ותעד את הממצאים' },
                  ]
                }
              };
              const rec = recommendations[result.riskLevel];
              return (
                <div className={`rounded-xl border p-5 ${rec.color}`}>
                  <h4 className={`text-sm font-semibold mb-3 ${rec.titleColor}`}>⚡ {rec.title}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {rec.actions.map((a, i) => (
                      <div key={i} className="bg-card/50 rounded-lg p-3 border border-border/50">
                        <p className="text-sm font-medium text-foreground">{a.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'זדוני', value: result.stats.malicious, color: 'text-red-400' },
                { label: 'חשוד', value: result.stats.suspicious, color: 'text-orange-400' },
                { label: 'לא מזוהה', value: result.stats.undetected, color: 'text-muted-foreground' },
                { label: 'נקי', value: result.stats.harmless, color: 'text-green-400' },
              ].map(s => (
                <div key={s.label} className="bg-card rounded-xl border border-border p-4 text-center">
                  <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">אחוז זיהוי</span>
                <span className="text-xs font-bold text-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>

            {/* Meta info */}
            {(result.country || result.asOwner || result.reputation !== undefined || result.tags?.length > 0) && (
              <div className="bg-card rounded-xl border border-border p-5 grid grid-cols-2 gap-4">
                {result.country && (
                  <div>
                    <p className="text-[10px] text-muted-foreground">מדינה</p>
                    <p className="text-sm text-foreground mt-1">{result.country}</p>
                  </div>
                )}
                {result.asOwner && (
                  <div>
                    <p className="text-[10px] text-muted-foreground">בעל ASN</p>
                    <p className="text-sm text-foreground mt-1">{result.asOwner}</p>
                  </div>
                )}
                {result.reputation !== undefined && (
                  <div>
                    <p className="text-[10px] text-muted-foreground">Reputation Score</p>
                    <p className={cn("text-sm font-bold mt-1", result.reputation < 0 ? 'text-red-400' : 'text-green-400')}>{result.reputation}</p>
                  </div>
                )}
                {result.tags?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground mb-2">תגיות</p>
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Detections */}
            {result.detections?.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3">מנועים שזיהו איום</h4>
                <div className="space-y-2">
                  {result.detections.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                      <span className="text-xs font-medium text-foreground">{d.engine}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{d.result}</span>
                        <Badge className={cn("text-[10px]", d.category === 'malicious' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white')}>
                          {d.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">היסטוריית בדיקות</h3>
          <div className="space-y-2">
            {history.map((r, i) => {
              const risk = riskConfig[r.riskLevel] || riskConfig.unknown;
              const TypeIcon = typeIcons[r.type] || Hash;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => { setQuery(r.query); setResult(r); setError(null); }}
                >
                  <div className="flex items-center gap-3">
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-[10px]">{typeLabels[r.type] || r.type}</Badge>
                    <span className="text-sm font-mono text-foreground">{r.query}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{r.stats.malicious}/{r.stats.total}</span>
                    <Badge className={cn("text-[10px]", risk.badge)}>{risk.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}