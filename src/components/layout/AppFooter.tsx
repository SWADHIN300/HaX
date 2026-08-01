export default function AppFooter() {
  return (
    <footer className="px-4 desktop:px-6 pt-8 pb-24 desktop:pb-8">
      <div className="border-t border-base-border pt-5 flex flex-col tablet:flex-row desktop:flex-row gap-4 items-start tablet:items-center desktop:items-center justify-between">
        <a href="/" className="flex items-center gap-2 rounded-md" aria-label="HaX home">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-amber via-accent-coral to-accent-rose flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-text-primary">
            Ha<span className="gradient-text">X</span>
          </span>
        </a>

        <a
          href="https://github.com/SWADHIN300/HaX"
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target inline-flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open HaX GitHub repository"
          title="GitHub: SWADHIN300/HaX"
        >
          <GitHubIcon />
        
        </a>
      </div>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.25 1.9-.38 2.88-.39.98.01 1.96.14 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.41.36.77 1.06.77 2.14v3.17c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

