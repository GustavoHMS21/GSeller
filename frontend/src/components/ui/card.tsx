import { cx } from "@/lib/cx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cx("rounded-lg border border-line bg-surface p-5", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  as: Heading = "h2",
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        <Heading className="text-lg font-semibold">{title}</Heading>
        {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
