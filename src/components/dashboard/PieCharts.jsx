import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0ea5e9', '#ef4444', '#f97316', '#eab308', '#22c55e', '#a855f7', '#ec4899'];

export default function PieCharts({ events }) {
  const typeData = [
    { name: 'Phishing', value: events.filter(e => e.eventType === 'Phishing').length || 1 },
    { name: 'Malware', value: events.filter(e => e.eventType === 'Malware').length || 1 },
    { name: 'Privilege Escalation', value: events.filter(e => e.eventType === 'Privilege Escalation').length || 1 },
    { name: 'Custom', value: events.filter(e => e.eventType === 'Custom').length || 1 },
  ];

  const sourceData = [
    { name: 'EDR', value: events.filter(e => e.detectionSource === 'EDR').length || 1 },
    { name: 'Firewall', value: 2 },
    { name: 'Active Directory', value: events.filter(e => e.detectionSource === 'Active Directory').length || 1 },
    { name: 'SAP', value: 1 },
    { name: 'Salesforce', value: events.filter(e => e.detectionSource === 'Salesforce').length || 1 },
    { name: 'Intune', value: events.filter(e => e.detectionSource === 'Intune').length || 1 },
    { name: 'Mail Gateway', value: events.filter(e => e.detectionSource === 'Mail Gateway').length || 1 },
  ];

  const renderChart = (data, title) => (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'hsl(222, 40%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {renderChart(typeData, 'פילוח לפי סוג אירוע')}
      {renderChart(sourceData, 'פילוח לפי מקור זיהוי')}
    </div>
  );
}