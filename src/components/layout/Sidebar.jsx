import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Shield, BookOpen, Search, 
  Network, Users, Sparkles, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/events', label: 'ניהול אירועים', icon: AlertTriangle },
  { path: '/playbooks', label: 'Playbooks', icon: BookOpen },
  { path: '/virustotal', label: 'VirusTotal', icon: Search },
  { path: '/mitre', label: 'Mitre Attack', icon: Shield },
  { path: '/soc-structure', label: 'מבנה SOC', icon: Users },
  { path: '/ai-playbook', label: 'AI Playbook', icon: Sparkles },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed right-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-l border-border z-50 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate">א.א. ייצור חשמל</h1>
            <p className="text-[10px] text-muted-foreground">SOC Operations Center</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary/15 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}