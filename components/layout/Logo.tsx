import Link from "next/link";
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
        <img src="/logo-mark.png" alt="Shillcoins" className="block h-[42px] w-[42px] shrink-0 object-contain sm:h-[46px] sm:w-[46px]" />
      ) : (
        <img src="/logo-full.png" alt="Shillcoins" className="block h-[48px] w-auto max-w-[240px] shrink-0 object-contain sm:h-[56px] sm:max-w-[280px]" />
      )}
    </Link>
  );
}
