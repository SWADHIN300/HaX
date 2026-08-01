import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Alert } from '../../types';

interface SidebarProps {
  activeAlerts: Alert[];
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

const navItems = [
  { to: '/', label: 'Feed', icon: FeedIcon },
  { to: '/alerts', label: 'Alerts', icon: AlertIcon },
  { to: '/saved', label: 'Saved', icon: SavedIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar({
  activeAlerts,
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  const labelClass = isCollapsed ? 'desktop:hidden' : '';

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="desktop:hidden fixed inset-0 bg-black/60 z-[45] cursor-default"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-base-card border-r border-base-border transition-[width,transform] duration-200 w-[268px] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } desktop:translate-x-0 ${isCollapsed ? 'desktop:w-[76px]' : 'desktop:w-[240px]'}`}
      >
        <div className={`px-4 py-5 flex items-center gap-2 ${isCollapsed ? 'desktop:justify-center desktop:px-3' : ''}`}>
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className={`flex items-center gap-2 rounded-md ${isCollapsed ? 'desktop:justify-center' : ''}`}
            aria-label="Go to home"
            title="Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber via-accent-coral to-accent-rose flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className={`text-xl font-bold tracking-tighter text-text-primary ${labelClass}`}>
              Ha<span className="gradient-text">X</span>
            </span>
          </NavLink>

          <div className={`ml-auto flex items-center gap-1 ${isCollapsed ? 'desktop:hidden' : ''}`}>
            <IconButton
              label="Close sidebar"
              title="Close sidebar"
              onClick={onCloseMobile}
              className="desktop:hidden"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <nav className={`flex-1 px-3 mt-1 ${isCollapsed ? 'desktop:px-2' : ''}`}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onCloseMobile}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors text-sm font-medium ${
                  isCollapsed ? 'desktop:justify-center desktop:px-0' : ''
                } ${
                  isActive
                    ? 'bg-base/50 text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-base/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span className={labelClass}>{label}</span>
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-amber to-accent-coral" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`px-4 pb-4 space-y-3 ${isCollapsed ? 'desktop:px-2' : ''}`}>

          <div className={isCollapsed ? 'desktop:hidden' : ''}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 px-1">
              Active Alerts
            </p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto hide-scrollbar">
              {activeAlerts.length === 0 ? (
                <p className="text-xs text-text-muted px-1">No active alerts</p>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-base/50 border border-base-border"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-sage flex-shrink-0" />
                    <span className="text-xs text-text-secondary truncate">
                      {alert.name}
                    </span>
                    <span className="ml-auto text-[10px] text-text-muted">
                      {alert.matchCount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <IconButton
            label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapsed}
            className={`hidden desktop:flex ${isCollapsed ? 'desktop:mx-auto' : 'desktop:w-full desktop:justify-start desktop:px-4'}`}
          >
            <CollapseIcon collapsed={isCollapsed} />
            <span className={labelClass}>Collapse</span>
          </IconButton>
        </div>
      </aside>
    </>
  );
}

function IconButton({
  label,
  title,
  onClick,
  className = '',
  children,
}: {
  label: string;
  title: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`tap-target flex items-center justify-center gap-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-base/40 transition-colors ${className}`}
      onClick={onClick}
      aria-label={label}
      title={title}
    >
      {children}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d={collapsed ? 'm14 9 3 3-3 3' : 'm17 9-3 3 3 3'} />
    </svg>
  );
}

function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent-amber)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AlertIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent-amber)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SavedIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'var(--color-accent-amber)' : 'none'} stroke={active ? 'var(--color-accent-amber)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent-amber)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

