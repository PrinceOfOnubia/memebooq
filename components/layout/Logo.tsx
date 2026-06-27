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
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Shillcoins">
      {iconOnly ? (
        <img src="/logo-mark.png" alt="Shillcoins" className="block h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
      ) : (
        <img src="/logo-full.png" alt="Shillcoins" className="block h-12 w-auto max-w-[240px] shrink-0 object-contain sm:h-14 sm:max-w-[280px]" />
      )}
    </Link>
  );
}
