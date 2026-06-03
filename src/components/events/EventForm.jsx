import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EVENT_TYPES, DETECTION_SOURCES, SEVERITIES, STATUSES } from '@/lib/demoData';

export default function EventForm({ event, onSave }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    eventType: event?.eventType || 'Custom',
    severity: event?.severity || 'Medium',
    status: event?.status || 'Open',
    detectionSource: event?.detectionSource || 'EDR',
    assignedAnalyst: event?.assignedAnalyst || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>כותרת</Label>
        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label>תיאור</Label>
        <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>סוג אירוע</Label>
          <Select value={form.eventType} onValueChange={v => setForm({ ...form, eventType: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>חומרה</Label>
          <Select value={form.severity} onValueChange={v => setForm({ ...form, severity: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>מקור זיהוי</Label>
          <Select value={form.detectionSource} onValueChange={v => setForm({ ...form, detectionSource: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{DETECTION_SOURCES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>סטטוס</Label>
          <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>אנליסט אחראי</Label>
        <Input value={form.assignedAnalyst} onChange={e => setForm({ ...form, assignedAnalyst: e.target.value })} />
      </div>
      <Button type="submit" className="w-full">שמור</Button>
    </form>
  );
}