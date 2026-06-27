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
        <img src="/logo-mark.png" alt="Shillcoins" className="block h-[44px] w-[44px] shrink-0 object-contain sm:h-[48px] sm:w-[48px]" />
      ) : (
        <img src="/logo-full.png" alt="Shillcoins" className="block h-[52px] w-auto max-w-[260px] shrink-0 object-contain sm:h-[64px] sm:max-w-[300px]" />
      )}
    </Link>
  );
}
