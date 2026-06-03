import React from 'react';
import { Users, Shield, Eye, Search, Monitor, Server, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    level: 'SOC Manager',
    title: 'מנהל SOC',
    description: 'ניהול כולל של מרכז הפעולות, קבלת החלטות אסטרטגיות, ותיאום בין הצוותים',
    icon: Shield,
    color: 'bg-primary/20 border-primary/40 text-primary',
    members: ['אבי ישראלי - מנהל SOC ראשי'],
  },
  {
    level: 'Tier 3',
    title: 'Threat Hunting & Forensics',
    description: 'ציד איומים מתקדם, חקירות פורנזיות מעמיקות, ופיתוח חוקי זיהוי חדשים',
    icon: Search,
    color: 'bg-red-500/20 border-red-500/40 text-red-400',
    members: ['ד"ר שרון מלכה - Threat Hunter', 'עמית נחום - Forensics Analyst'],
  },
  {
    level: 'Tier 2',
    title: 'חקירה ותגובה לאירועים',
    description: 'חקירת אירועים מורכבים, תגובה לאיומים, והפעלת Playbooks מתקדמים',
    icon: Eye,
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    members: ['יוסי אברהם - Incident Responder', 'נועה גולדברג - SOC Analyst L2', 'דוד מרכוס - Security Analyst'],
  },
  {
    level: 'Tier 1',
    title: 'ניטור וסינון ראשוני',
    description: 'ניטור 24/7 של אלרטים, סינון ראשוני, ותיעוד אירועים',
    icon: Monitor,
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
    members: ['דני כהן - SOC Analyst L1', 'מיכל לוי - SOC Analyst L1', 'רונית שמש - SOC Analyst L1', 'אילן מזרחי - SOC Analyst L1'],
  },
];

const supportTeams = [
  { name: 'צוות IT', description: 'תמיכה בתשתיות IT, Active Directory, ורשתות משרדיות', icon: Server, color: 'bg-blue-500/20 border-blue-500/40 text-blue-400', members: ['יוני ברק', 'שגיא כץ'] },
  { name: 'צוות OT', description: 'אבטחת מערכות SCADA/ICS, תחנות כוח, וטורבינות', icon: Monitor, color: 'bg-purple-500/20 border-purple-500/40 text-purple-400', members: ['מאיר חדד', 'ענבל פרץ'] },
  { name: 'ספק IR חיצוני', description: 'Incident Response חיצוני לאירועים קריטיים', icon: Phone, color: 'bg-green-500/20 border-green-500/40 text-green-400', members: ['CyberProof IR Team'] },
];

export default function SOCStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">מבנה SOC</h1>
        <p className="text-sm text-muted-foreground mt-1">א.א. ייצור חשמל ותחנות כוח · מרכז פעולות סייבר</p>
      </div>

      {/* Hierarchy */}
      <div className="space-y-0">
        {tiers.map((tier, i) => (
          <div key={tier.level} className="relative">
            {/* Connector line */}
            {i > 0 && (
              <div className="absolute right-8 -top-0 w-0.5 h-0 bg-border" />
            )}
            
            <div className={cn("bg-card rounded-xl border p-5 relative", tier.color.replace('text-', 'border-').split(' ')[1])}>
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", tier.color.split(' ')[0])}>
                  <tier.icon className={cn("w-6 h-6", tier.color.split(' ')[2])} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{tier.level}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{tier.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tier.members.map(m => (
                      <div key={m} className="flex items-center gap-2 text-xs bg-secondary/50 rounded-lg px-3 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                          <Users className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow down */}
            {i < tiers.length - 1 && (
              <div className="flex justify-center py-2">
                <ChevronDown className="w-5 h-5 text-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support Teams */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">צוותים תומכים</h2>
        <div className="grid grid-cols-3 gap-4">
          {supportTeams.map(team => (
            <div key={team.name} className={cn("bg-card rounded-xl border p-5", team.color.replace('text-', 'border-').split(' ')[1])}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", team.color.split(' ')[0])}>
                  <team.icon className={cn("w-5 h-5", team.color.split(' ')[2])} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{team.name}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{team.description}</p>
              <div className="space-y-1">
                {team.members.map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}