import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, BookOpen, AlertTriangle, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const demoPlaybook = {
  name: 'USB Unauthorized Device in OT Control Station',
  trigger: 'זיהוי התקן USB לא מורשה בעמדת בקרה תחנת כוח גז',
  severity: 'Critical',
  detectionSource: 'Endpoint Protection / Physical Security',
  identificationSteps: [
    'אימות אלרט מ-Endpoint Protection על התקן USB חדש',
    'זיהוי עמדת הבקרה שבה הוכנס ההתקן (Host ID, IP)',
    'בדיקת מצלמות אבטחה לזיהוי מי הכניס את ההתקן',
    'חילוץ לוגים של הטעינת USB Driver ופעילות קבצים',
  ],
  investigationSteps: [
    'בדיקת תוכן ההתקן לנוכחות קבצים זדוניים',
    'שליחת Hash של קבצים חשודים ל-VirusTotal',
    'בדיקה האם הותקנו תוכנות או סקריפטים מהתקן',
    'בדיקת תעבורת רשת חריגה מעמדת הבקרה',
    'אימות מול רשימת התקני USB מורשים',
  ],
  containmentSteps: [
    'ניתוק מיידי של עמדת הבקרה מרשת ה-OT',
    'הסרת התקן ה-USB ושמירתו כראיה פיזית',
    'בידוד לוגי של העמדה באמצעות EDR/NAC',
    'חסימת כל תקשורת חיצונית מהעמדה',
    'סריקת עמדות בקרה סמוכות באותו Segment',
  ],
  responseActions: [
    'סריקת AV/EDR מלאה של עמדת הבקרה',
    'בדיקת שלמות קבצי מערכת SCADA',
    'השוואת קונפיגורציית PLC לגיבוי אחרון',
    'חיזוק מדיניות USB בכל עמדות OT',
    'עדכון חוקי זיהוי ב-SIEM',
  ],
  escalation: 'הסלמה מיידית למנהל SOC, מנהל OT, וספק IR חיצוני. דיווח לממונה על הגנת סייבר בארגון.',
  closureCondition: 'העמדה נוקתה ואומתה, ההתקן נבדק פיזית ודיגיטלית, לא נמצאה פעילות זדונית ברשת OT, ומדיניות USB עודכנה.',
};

export default function AIPlaybook() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    const isCommonPlaybook = examples.some(ex => ex === input.trim());

    if (isCommonPlaybook) {
      setTimeout(() => {
        setResult(demoPlaybook);
        setLoading(false);
      }, 3000);
      return;
    }

    // Generate dynamic playbook using LLM
    const { base44 } = await import('@/api/base44Client');
    const generated = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה מומחה SOC בתחום אבטחת סייבר לתשתיות קריטיות (חשמל, אנרגיה, OT/ICS).
צור Playbook מפורט לתגובה לאירוע הבא: "${input.trim()}"

החזר JSON בדיוק בפורמט הזה (בעברית):
{
  "name": "שם קצר לplaybook",
  "trigger": "תיאור הtrigger",
  "severity": "Critical/High/Medium/Low",
  "detectionSource": "מקור הזיהוי",
  "identificationSteps": ["שלב 1", "שלב 2", "שלב 3", "שלב 4"],
  "investigationSteps": ["שלב 1", "שלב 2", "שלב 3", "שלב 4", "שלב 5"],
  "containmentSteps": ["שלב 1", "שלב 2", "שלב 3", "שלב 4"],
  "responseActions": ["פעולה 1", "פעולה 2", "פעולה 3", "פעולה 4"],
  "escalation": "תיאור הסלמה",
  "closureCondition": "תנאי סגירה"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          trigger: { type: "string" },
          severity: { type: "string" },
          detectionSource: { type: "string" },
          identificationSteps: { type: "array", items: { type: "string" } },
          investigationSteps: { type: "array", items: { type: "string" } },
          containmentSteps: { type: "array", items: { type: "string" } },
          responseActions: { type: "array", items: { type: "string" } },
          escalation: { type: "string" },
          closureCondition: { type: "string" },
        }
      }
    });

    setResult(generated);
    setLoading(false);
  };

  const examples = [
    'זיהוי התקן USB זר ולא מורשה שהוכנס פיזית לעמדת ההפעלה והבקרה המרכזית בתחנת כוח המופעלת בגז.',
    'ניסיון פישינג ממוקד (Spear Phishing) נגד עובד מחלקת IT עם קישור לאיסוף אישורי גישה.',
    'זיהוי תעבורת C2 (Command & Control) חשודה מתחנת עבודה ברשת ה-OT.',
    'כופרה (Ransomware) הצפינה תיקיות שיתוף ברשת הפנימית.',
    'גישה לא מורשית לממשק ניהול של PLC תחת ה-SCADA.',
    'גילוי סריקת פורטים פנימית (Internal Port Scan) ממארח שנפרץ.',
    'דליפת נתונים חשודה – העברת קבצים גדולים מחוץ לארגון דרך SFTP.',
    'ניסיון Brute Force על מערכת VPN הארגוני ממספר IP חיצוניים.',
    'זיהוי תוכנת כריית מטבעות קריפטו (Cryptominer) על שרת ייצור.',
    'Lateral Movement שזוהה – חשבון משתמש מנצל Pass-the-Hash לגישה לשרתים נוספים.',
    'אתר ניהול אינטרנטי (Web Admin Panel) חשוף לאינטרנט עם ניצול SQLi.',
    'זיהוי Insider Threat – עובד מוריד כמויות חריגות של מידע רגיש לפני עזיבה.',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> AI Playbook Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">הזן תיאור אירוע סייבר וקבל טיוטת Playbook אוטומטית</p>
      </div>

      {/* Input */}
      <div className="bg-card rounded-xl border border-border p-6">
        <Textarea
          placeholder="תאר אירוע סייבר חדש... לדוגמה: זיהוי התקן USB זר בעמדת בקרה בתחנת כוח"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          className="text-sm"
        />
        <div className="flex items-center justify-end mt-3">
          <Button onClick={handleGenerate} disabled={loading || !input.trim()} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'מייצר Playbook...' : 'צור Playbook'}
          </Button>
        </div>
      </div>

      {/* Common Playbooks */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Common Playbooks</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="text-right p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-secondary/40 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed line-clamp-2">{ex}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">מנתח את תיאור האירוע ומייצר Playbook מותאם...</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">טיוטת Playbook</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success('Playbook הועתק ללוח')}>
              <Copy className="w-3.5 h-3.5" /> העתק
            </Button>
          </div>

          {/* Header card */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{result.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-red-500 text-white text-[10px]">{result.severity}</Badge>
                  <Badge variant="outline" className="text-[10px]">{result.detectionSource}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Trigger</p>
                <p className="text-sm text-foreground mt-1">{result.trigger}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">מקור זיהוי</p>
                <p className="text-sm text-foreground mt-1">{result.detectionSource}</p>
              </div>
            </div>
          </div>

          {/* Steps sections */}
          <div className="grid grid-cols-2 gap-4">
            <StepSection title="שלבי זיהוי" steps={result.identificationSteps} icon={<Shield className="w-4 h-4 text-blue-400" />} color="blue" />
            <StepSection title="שלבי תחקור" steps={result.investigationSteps} icon={<Zap className="w-4 h-4 text-yellow-400" />} color="yellow" />
            <StepSection title="שלבי הכלה" steps={result.containmentSteps} icon={<AlertTriangle className="w-4 h-4 text-orange-400" />} color="orange" />
            <StepSection title="פעולות תגובה" steps={result.responseActions} icon={<CheckCircle className="w-4 h-4 text-green-400" />} color="green" />
          </div>

          {/* Escalation & Closure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-orange-500/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-semibold text-orange-400">הסלמה</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.escalation}</p>
            </div>
            <div className="bg-card rounded-xl border border-green-500/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h4 className="text-sm font-semibold text-green-400">תנאי סגירה</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.closureCondition}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepSection({ title, steps, icon, color }) {
  const borderColor = {
    blue: 'border-blue-500/30',
    yellow: 'border-yellow-500/30',
    orange: 'border-orange-500/30',
    green: 'border-green-500/30',
  }[color];

  return (
    <div className={cn("bg-card rounded-xl border p-5", borderColor)}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-muted-foreground bg-secondary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-xs text-muted-foreground">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}