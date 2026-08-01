import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullScreenMobile?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  fullScreenMobile = true,
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative z-10 bg-base-card border border-base-border animate-fade-in
          ${
            fullScreenMobile
              ? 'mobile:fixed mobile:inset-0 mobile:rounded-none mobile:border-0 mobile:overflow-y-auto'
              : ''
          }
          desktop:rounded-xl desktop:max-w-2xl desktop:w-full desktop:mx-4 desktop:max-h-[85vh] desktop:overflow-y-auto
          tablet:rounded-xl tablet:max-w-lg tablet:w-full tablet:mx-4 tablet:max-h-[85vh] tablet:overflow-y-auto
        `}
      >
        {/* Header */}
        {(title || fullScreenMobile) && (
          <div className="sticky top-0 bg-base-card/95 backdrop-blur-sm border-b border-base-border px-4 desktop:px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="tap-target flex items-center justify-center -mr-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className={title ? '' : 'pt-0'}>{children}</div>
      </div>
    </div>
  );
}
