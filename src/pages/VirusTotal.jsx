import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { virusTotalDemoResults } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const riskColors = {
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
};

export default function VirusTotal() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(virusTotalDemoResults);

  const handleCheck = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const demo = virusTotalDemoResults.find(r => r.query === query.trim());
      const newResult = demo || {
        query: query.trim(),
        type: query.includes('.') ? (query.includes('/') ? 'URL' : (query.includes(':') ? 'IP' : 'Domain')) : 'Hash',
        score: `${Math.floor(Math.random() * 30)}/72`,
        engines: 72,
        detected: Math.floor(Math.random() * 30),
        threat: 'Suspicious Activity',
        recommendation: Math.random() > 0.5 ? 'חסימה' : 'ניטור נוסף',
        risk: Math.random() > 0.5 ? 'High' : 'Medium',
      };
      setResult(newResult);
      if (!demo) setHistory(prev => [newResult, ...prev]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">בדיקת VirusTotal</h1>
        <p className="text-sm text-muted-foreground mt-1">בדיקת Hash, IP, דומיין או URL מול מנועי VirusTotal</p>
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
          <Button onClick={handleCheck} disabled={loading} className="gap-2 min-w-[140px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'בודק...' : 'בדוק ב-VirusTotal'}
          </Button>
        </div>

        {/* Quick buttons */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs text-muted-foreground">דוגמאות:</span>
          {virusTotalDemoResults.map(r => (
            <button
              key={r.query}
              onClick={() => setQuery(r.query)}
              className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {r.query}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">תוצאת בדיקה</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 flex flex-col items-center justify-center p-6 rounded-xl bg-secondary/50">
              <div className={cn("text-4xl font-bold", riskColors[result.risk])}>{result.score}</div>
              <p className="text-xs text-muted-foreground mt-2">Malicious Score</p>
              <div className="w-full mt-3">
                <Progress value={(result.detected / result.engines) * 100} className="h-2" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{result.detected} מתוך {result.engines} מנועים</p>
            </div>
            <div className="col-span-3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">שאילתה</p>
                  <p className="text-sm font-mono text-foreground mt-1 break-all">{result.query}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">סוג</p>
                  <p className="text-sm font-medium text-foreground mt-1">{result.type}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">סוג איום</p>
                  <p className="text-sm font-medium text-foreground mt-1">{result.threat}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">רמת סיכון</p>
                  <Badge className={cn("mt-1", result.risk === 'Critical' ? 'bg-red-500 text-white' : result.risk === 'High' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black')}>
                    {result.risk}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">המלצת פעולה: {result.recommendation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">היסטוריית בדיקות</h3>
        <div className="space-y-2">
          {history.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                <span className="text-sm font-mono text-foreground">{r.query}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{r.threat}</span>
                <Badge className={cn(r.risk === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white', 'text-[10px]')}>
                  {r.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}