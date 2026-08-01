import { NavLink } from 'react-router-dom';

interface TopBarProps {
  unreadCount: number;
  onMenuClick: () => void;
}

export default function TopBar({
  unreadCount,
  onMenuClick,
}: TopBarProps) {
  return (
    <header className="desktop:hidden fixed top-0 left-0 right-0 h-14 bg-base-card border-b border-base-border z-40 flex items-center justify-between px-3">
      <button
        type="button"
        className="tap-target flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        title="Open sidebar"
      >
        <MenuIcon />
      </button>

      <NavLink
        to="/"
        className="flex items-center gap-2 rounded-md px-1 py-1"
        aria-label="Go to home"
      >
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-amber via-accent-coral to-accent-rose flex items-center justify-center">
          <span className="text-white font-bold text-xs">H</span>
        </div>
        <span className="text-lg font-bold tracking-tighter text-text-primary">
          Ha<span className="gradient-text">X</span>
        </span>
      </NavLink>

      <div className="flex items-center gap-1">

        <button
          type="button"
          className="relative tap-target flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Alerts"
          title="Alerts"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-coral text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

