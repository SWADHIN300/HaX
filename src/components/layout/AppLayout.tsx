import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import AppFooter from './AppFooter';
import type { Alert } from '../../types';

interface AppLayoutProps {
  activeAlerts: Alert[];
  unreadCount: number;
}

export default function AppLayout({ activeAlerts, unreadCount }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base">
      <Sidebar
        activeAlerts={activeAlerts}
        isCollapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((open) => !open)}
      />

      <TopBar
        unreadCount={unreadCount}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <main
        className={`pt-14 desktop:pt-0 pb-20 desktop:pb-0 min-h-screen transition-[margin] duration-200 ${
          sidebarCollapsed ? 'desktop:ml-[76px]' : 'desktop:ml-[240px]'
        }`}
      >
        <Outlet />
        <AppFooter />
      </main>

      <BottomTabBar />
    </div>
  );
}
