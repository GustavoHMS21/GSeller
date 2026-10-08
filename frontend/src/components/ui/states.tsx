import { cx } from "@/lib/cx";

/** Estado vazio que ensina o próximo passo (Bloco 16.2, princípio 6). */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line px-6 py-10 text-center">
      <span aria-hidden="true" className="text-2xl text-fg-muted">
        ○
      </span>
      <p className="font-medium">{title}</p>
      <p className="max-w-md text-sm text-fg-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Não foi possível carregar estes dados",
  description,
  action,
}: {
  title?: string;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-6 py-10 text-center"
    >
      <span aria-hidden="true" className="text-2xl text-danger">
        ■
      </span>
      <p className="font-medium text-danger">{title}</p>
      <p className="max-w-md text-sm text-fg-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx("animate-pulse rounded-md bg-surface-muted", className)} />
  );
}
