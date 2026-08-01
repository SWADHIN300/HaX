import { useEffect, useState, type FormEvent } from 'react';
import ToggleSwitch from '../components/ui/ToggleSwitch';

interface Profile {
  name: string;
  email: string;
}

const DEFAULT_PROFILE: Profile = {
  name: 'Swadhin',
  email: 'swadhin@example.com',
};

function readBoolean(key: string, fallback: boolean) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : stored === 'true';
  } catch {
    return fallback;
  }
}

function readProfile(): Profile {
  try {
    const stored = localStorage.getItem('hax-profile');
    if (!stored) return DEFAULT_PROFILE;
    const parsed = JSON.parse(stored) as Partial<Profile>;
    return {
      name: parsed.name?.trim() || DEFAULT_PROFILE.name,
      email: parsed.email?.trim() || DEFAULT_PROFILE.email,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(() => readBoolean('hax-push-notifications', true));
  const [emailEnabled, setEmailEnabled] = useState(() => readBoolean('hax-email-notifications', false));
  const [weeklyDigest, setWeeklyDigest] = useState(() => readBoolean('hax-weekly-digest', true));
  const [profile, setProfile] = useState<Profile>(readProfile);
  const [draftProfile, setDraftProfile] = useState<Profile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    localStorage.setItem('hax-push-notifications', String(pushEnabled));
  }, [pushEnabled]);

  useEffect(() => {
    localStorage.setItem('hax-email-notifications', String(emailEnabled));
  }, [emailEnabled]);

  useEffect(() => {
    localStorage.setItem('hax-weekly-digest', String(weeklyDigest));
  }, [weeklyDigest]);

  useEffect(() => {
    localStorage.setItem('hax-profile', JSON.stringify(profile));
  }, [profile]);

  const [theme, setTheme] = useState(() => localStorage.getItem('hax-theme') || 'dark');

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('hax-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-color-theme', 'light');
      setFeedback('Light theme activated.');
    } else {
      document.documentElement.removeAttribute('data-color-theme');
      setFeedback('Dark theme activated.');
    }
  };

  const handleEditProfile = () => {
    setDraftProfile(profile);
    setIsEditing(true);
    setFeedback('');
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draftProfile.name.trim();
    const email = draftProfile.email.trim();
    if (!name || !email) {
      setFeedback('Name and email are required.');
      return;
    }
    setProfile({ name, email });
    setIsEditing(false);
    setFeedback('Profile saved.');
  };

  const handleSignOut = () => {
    setProfile({ name: 'Guest', email: 'Not signed in' });
    setIsEditing(false);
    setFeedback('Signed out of this demo account.');
  };

  const handleSignIn = () => {
    setProfile(DEFAULT_PROFILE);
    setFeedback('Signed in as Swadhin.');
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 desktop:px-6 pt-5 desktop:pt-6 pb-4">
        <h1 className="text-xl desktop:text-2xl font-bold tracking-tighter text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your preferences
        </p>
      </div>

      <div className="px-4 desktop:px-6 pb-6 space-y-6 desktop:max-w-2xl">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Notifications
          </h2>
          <div className="card divide-y divide-base-border">
            <div className="p-4">
              <ToggleSwitch
                enabled={pushEnabled}
                onToggle={() => setPushEnabled((enabled) => !enabled)}
                label="Push Notifications"
                description="Get notified about new hackathons matching your alerts"
              />
            </div>
            <div className="p-4">
              <ToggleSwitch
                enabled={emailEnabled}
                onToggle={() => setEmailEnabled((enabled) => !enabled)}
                label="Email Notifications"
                description="Receive hackathon updates via email"
              />
            </div>
            <div className="p-4">
              <ToggleSwitch
                enabled={weeklyDigest}
                onToggle={() => setWeeklyDigest((enabled) => !enabled)}
                label="Weekly Digest"
                description="Summary of top hackathons sent every Monday"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Appearance
          </h2>
          <div className="card p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Choose your preferred appearance
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-base-border border-accent-amber text-text-primary'
                      : 'bg-base border-base-border hover:border-accent-amber/50 text-text-secondary'
                  }`}
                  aria-label="Use light theme"
                >
                  <SunIcon />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-base-border border-accent-amber text-text-primary'
                      : 'bg-base border-base-border hover:border-accent-amber/50 text-text-secondary'
                  }`}
                  aria-label="Use dark theme"
                >
                  <MoonIcon />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Account
          </h2>
          <div className="card p-4 space-y-4">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <label className="block">
                  <span className="text-xs text-text-secondary">Name</span>
                  <input
                    value={draftProfile.name}
                    onChange={(event) => setDraftProfile((draft) => ({ ...draft, name: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-base-border bg-base px-3 py-2 text-sm text-text-primary focus:border-accent-amber/60 outline-none"
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-text-secondary">Email</span>
                  <input
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) => setDraftProfile((draft) => ({ ...draft, email: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-base-border bg-base px-3 py-2 text-sm text-text-primary focus:border-accent-amber/60 outline-none"
                  />
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="btn-gradient text-sm flex-1">Save Profile</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost text-sm flex-1">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-amber to-accent-coral flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{profile.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{profile.name}</p>
                    <p className="text-xs text-text-muted">{profile.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {profile.email === 'Not signed in' ? (
                    <button type="button" onClick={handleSignIn} className="btn-gradient text-sm flex-1">Sign In</button>
                  ) : (
                    <button type="button" onClick={handleEditProfile} className="btn-ghost text-sm flex-1">Edit Profile</button>
                  )}
                  {profile.email !== 'Not signed in' && (
                    <button type="button" onClick={handleSignOut} className="btn-ghost text-sm flex-1 !border-accent-coral/30 text-accent-coral hover:!bg-accent-coral/5">
                      Sign Out
                    </button>
                  )}
                </div>
              </>
            )}
            {feedback && <p className="text-xs text-accent-sage" role="status">{feedback}</p>}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            About
          </h2>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-amber via-accent-coral to-accent-rose flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">H</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-text-primary">HaX</span>
              <span className="text-xs text-text-muted">v1.0.0</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Your personal hackathon discovery and alert dashboard. Stay ahead of the best hackathons across AI, Web3, Fintech, and more.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent-amber" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-amber" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}