import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface FocusLossWarningProps {
  show: boolean;
  count: number;
}

export function FocusLossWarning({ show, count }: FocusLossWarningProps) {
  useEffect(() => {
    if (!show) return;
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 shadow-lg flex items-center gap-2 animate-[fadeInDown_0.3s_ease-out]';
    toast.innerHTML = '<svg class="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg><span class="text-sm font-medium text-amber-800 dark:text-amber-200">Tab focus lost (' + count + '). This is tracked in your report.</span>';
    document.body.appendChild(toast);
    const timer = setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
    return () => {
      clearTimeout(timer);
      toast.remove();
    };
  }, [show, count]);

  return null;
}

export function FocusLossIcon({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>{count} focus loss{count > 1 ? 'es' : ''}</span>
    </div>
  );
}
