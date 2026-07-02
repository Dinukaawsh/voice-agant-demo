import { MockShell } from "@/components/shell/MockShell";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MockShell>{children}</MockShell>;
}
