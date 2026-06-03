import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        collapsed ? "mr-16" : "mr-60"
      )}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}