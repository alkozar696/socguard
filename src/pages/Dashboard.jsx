import React from 'react';
import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { demoEvents } from '@/lib/demoData';
import StatCard from '@/components/dashboard/StatCard';
import SeverityCards from '@/components/dashboard/SeverityCards';
import TrendChart from '@/components/dashboard/TrendChart';
import PieCharts from '@/components/dashboard/PieCharts';
import RecentCritical from '@/components/dashboard/RecentCritical';
import MetricsBar from '@/components/dashboard/MetricsBar';
import VTMitrePreview from '@/components/dashboard/VTMitrePreview';

export default function Dashboard() {
  const openEvents = demoEvents.filter(e => e.status !== 'Closed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">מרכז פיקוד SOC</h1>
          <p className="text-sm text-muted-foreground mt-1">א.א. ייצור חשמל ותחנות כוח · סקירה כללית</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">מערכת פעילה</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="אירועים פתוחים" value={openEvents.length} icon={AlertTriangle} color="text-red-400" subtitle="מתוך 5 אירועים" />
        <StatCard title="באיום גבוה" value={demoEvents.filter(e => e.severity === 'Critical' || e.severity === 'High').length} icon={ShieldAlert} color="text-orange-400" subtitle="Critical + High" />
        <StatCard title="אירועים היום" value={3} icon={Activity} color="text-primary" subtitle="עד כה" />
      </div>

      {/* Severity breakdown */}
      <SeverityCards events={demoEvents} />

      {/* Metrics */}
      <MetricsBar />

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <TrendChart />
        </div>
        <div className="col-span-2">
          <RecentCritical events={demoEvents} />
        </div>
      </div>

      {/* Pie Charts */}
      <PieCharts events={demoEvents} />

      {/* VT & MITRE Preview */}
      <VTMitrePreview />
    </div>
  );
}