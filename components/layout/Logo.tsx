import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  iconOnly = false,
}: {
  className?: string;
  href?: string;
  iconOnly?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label="Shillcoins">
      {iconOnly ? (
        <img src="/logo-mark.png" alt="Shillcoins" className="h-9 w-9 shrink-0" />
      ) : (
        <img src="/logo-full.png" alt="Shillcoins" className="h-11 w-auto max-w-[220px] shrink-0" />
      )}
    </Link>
  );
}
