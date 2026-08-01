import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const dragging = useRef(false);

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

  const onDragStart = useCallback((clientY: number) => {
    startY.current = clientY;
    dragging.current = true;
  }, []);

  const onDragMove = useCallback((clientY: number) => {
    if (!dragging.current) return;
    const diff = clientY - startY.current;
    if (diff > 0) setDragY(diff);
  }, []);

  const onDragEnd = useCallback(() => {
    dragging.current = false;
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  }, [dragY, onClose]);

  if (!isOpen) return null;

  return (
    <div className="desktop:hidden fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-base-card rounded-t-2xl animate-slide-up max-h-[85vh] overflow-y-auto"
        style={{ transform: `translateY(${dragY}px)` }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
          onTouchEnd={onDragEnd}
          onMouseDown={(e) => onDragStart(e.clientY)}
          onMouseMove={(e) => { if (dragging.current) onDragMove(e.clientY); }}
          onMouseUp={onDragEnd}
        >
          <div className="w-10 h-1 rounded-full bg-base-border" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="tap-target flex items-center justify-center text-text-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-8">{children}</div>
      </div>
    </div>
  );
}
