type BadgeVariant = "default" | "blue" | "green" | "amber";

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-ink-muted",
  blue: "bg-accent-soft text-accent",
  green: "bg-green-soft text-green",
  amber: "bg-amber-50 text-amber-700",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
