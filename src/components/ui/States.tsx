import { FileSearch, AlertTriangle } from "lucide-react";

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center border border-dashed border-line bg-paper px-6 py-16 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center border border-line bg-white text-brand-600">
        <FileSearch className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl text-brand-900">{title}</h2>
      <p className="mt-2 max-w-md text-ink-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div role="alert" className="flex flex-col items-center border border-danger/30 bg-danger/[0.04] px-6 py-16 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center border border-danger/30 bg-white text-danger">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl text-brand-900">{title}</h2>
      <p className="mt-2 max-w-md text-ink-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Generic skeleton block used by loading.tsx files. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse bg-brand-100/70 ${className}`} />;
}
