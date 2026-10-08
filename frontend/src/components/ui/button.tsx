import Link from "next/link";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-fg hover:bg-surface-muted",
  ghost: "text-primary hover:bg-surface-muted",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={cx(BASE, VARIANT[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(BASE, VARIANT[variant], className)} {...props} />;
}
