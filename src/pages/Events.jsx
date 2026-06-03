import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { demoEvents, SEVERITY_CONFIG, STATUS_CONFIG, EVENT_TYPES, DETECTION_SOURCES, SEVERITIES, STATUSES } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import EventForm from '@/components/events/EventForm';

export default function Events() {
  const [events, setEvents] = useState(demoEvents);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const filtered = events.filter(e => {
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (typeFilter !== 'all' && e.eventType !== typeFilter) return false;
    if (sourceFilter !== 'all' && e.detectionSource !== sourceFilter) return false;
    if (searchQuery && !e.title.includes(searchQuery) && !e.id.includes(searchQuery)) return false;
    return true;
  });

  const handleStatusChange = (eventId, newStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
  };

  const handleSave = (eventData) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e));
    } else {
      const newEvent = {
        ...eventData,
        id: `EVT-${String(events.length + 1).padStart(3, '0')}`,
        reportedTime: new Date().toISOString(),
        timeline: [{ time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), action: 'אירוע נוצר', actor: 'מערכת' }],
        evidence: { files: [], hashes: [], ips: [], urls: [], logs: [] },
        virusTotalResult: null,
        mitreMapping: [],
      };
      setEvents(prev => [newEvent, ...prev]);
    }
    setDialogOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ניהול אירועים</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} אירועים מוצגים</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingEvent(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> אירוע חדש</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'עריכת אירוע' : 'אירוע חדש'}</DialogTitle>
            </DialogHeader>
            <EventForm event={editingEvent} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="חיפוש..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pr-9" />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="חומרה" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל החומרות</SelectItem>
            {SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="סוג אירוע" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסוגים</SelectItem>
            {EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="מקור זיהוי" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל המקורות</SelectItem>
            {DETECTION_SOURCES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">מזהה</TableHead>
              <TableHead className="text-right">כותרת</TableHead>
              <TableHead className="text-right">סוג</TableHead>
              <TableHead className="text-right">חומרה</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">מקור</TableHead>
              <TableHead className="text-right">אנליסט</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(event => (
              <TableRow key={event.id} className="hover:bg-secondary/30 transition-colors">
                <TableCell className="font-mono text-xs text-primary">{event.id}</TableCell>
                <TableCell>
                  <Link to={`/events/${event.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{event.eventType}</TableCell>
                <TableCell>
                  <Badge className={cn("text-[10px]", SEVERITY_CONFIG[event.severity].badge)}>{event.severity}</Badge>
                </TableCell>
                <TableCell>
                  <Select value={event.status} onValueChange={(val) => handleStatusChange(event.id, val)}>
                    <SelectTrigger className={cn("h-7 text-xs border-0 w-32", STATUS_CONFIG[event.status].color)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{event.detectionSource}</TableCell>
                <TableCell className="text-xs">{event.assignedAnalyst}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setEditingEvent(event); setDialogOpen(true); }}>
                      ערוך
                    </Button>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">פרטים</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}