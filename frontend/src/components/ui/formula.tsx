/** "Como calculamos?" — disclosure nativo, acessível por teclado e sem JavaScript. */
export function Formula({
  children,
  label = "Como calculamos?",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <details className="text-sm">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-primary hover:text-primary-hover [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="text-xs">
          ⓘ
        </span>
        {label}
      </summary>
      <div className="mt-2 space-y-1 rounded-md bg-surface-muted p-3 text-fg-muted">{children}</div>
    </details>
  );
}
