import { useState } from 'react';
import ToggleSwitch from '../components/ui/ToggleSwitch';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 desktop:px-6 pt-5 desktop:pt-6 pb-4">
        <h1 className="text-xl desktop:text-2xl font-bold tracking-tighter text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your preferences
        </p>
      </div>

      <div className="px-4 desktop:px-6 pb-6 space-y-6 desktop:max-w-2xl">
        {/* Notification Preferences */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Notifications
          </h2>
          <div className="card divide-y divide-base-border">
            <div className="p-4">
              <ToggleSwitch
                enabled={pushEnabled}
                onToggle={() => setPushEnabled(!pushEnabled)}
                label="Push Notifications"
                description="Get notified about new hackathons matching your alerts"
              />
            </div>
            <div className="p-4">
              <ToggleSwitch
                enabled={emailEnabled}
                onToggle={() => setEmailEnabled(!emailEnabled)}
                label="Email Notifications"
                description="Receive hackathon updates via email"
              />
            </div>
            <div className="p-4">
              <ToggleSwitch
                enabled={weeklyDigest}
                onToggle={() => setWeeklyDigest(!weeklyDigest)}
                label="Weekly Digest"
                description="Summary of top hackathons sent every Monday"
              />
            </div>
          </div>
        </section>

        {/* Theme */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Appearance
          </h2>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Dark mode only for v1 — light theme coming soon
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base border border-base-border">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-accent-amber"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="text-xs font-medium text-text-primary">
                  Dark
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Account
          </h2>
          <div className="card p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-amber to-accent-coral flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Swadhin
                </p>
                <p className="text-xs text-text-muted">swadhin@example.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost text-sm flex-1">Edit Profile</button>
              <button className="btn-ghost text-sm flex-1 !border-accent-coral/30 text-accent-coral hover:!bg-accent-coral/5">
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            About
          </h2>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-amber via-accent-coral to-accent-rose flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">H</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-text-primary">
                HaX
              </span>
              <span className="text-xs text-text-muted">v1.0.0</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Your personal hackathon discovery and alert dashboard. Stay ahead 
              of the best hackathons across AI, Web3, Fintech, and more.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
