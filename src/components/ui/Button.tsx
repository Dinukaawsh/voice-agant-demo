import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonColor = "brand" | "violet" | "blue" | "neutral";

const variantColorMap: Record<ButtonVariant, ButtonColor> = {
  primary: "brand",
  secondary: "neutral",
  ghost: "neutral",
};

const colorClass: Record<ButtonColor, string> = {
  brand: "btn-theme-brand",
  violet: "btn-theme-brand",
  blue: "btn-theme-brand",
  neutral: "btn-theme-neutral",
};

export function Button({
  children,
  variant = "primary",
  color,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
}) {
  const resolvedColor = color ?? variantColorMap[variant];
  const themeClass =
    variant === "ghost" ? "btn-theme-ghost" : colorClass[resolvedColor];

  return (
    <button
      type="button"
      className={cn(
        "btn-theme inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50",
        themeClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
