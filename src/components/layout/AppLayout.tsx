import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import AppFooter from './AppFooter';
import { useColorTheme } from '../../hooks/useColorTheme';
import type { Alert } from '../../types';

interface AppLayoutProps {
  activeAlerts: Alert[];
  unreadCount: number;
}

export default function AppLayout({ activeAlerts, unreadCount }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { themeLabel, cycleTheme } = useColorTheme();

  return (
    <div className="min-h-screen bg-base">
      <Sidebar
        activeAlerts={activeAlerts}
        isCollapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        colorThemeLabel={themeLabel}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((open) => !open)}
        onCycleTheme={cycleTheme}
      />

      <TopBar
        unreadCount={unreadCount}
        colorThemeLabel={themeLabel}
        onMenuClick={() => setMobileSidebarOpen(true)}
        onCycleTheme={cycleTheme}
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
