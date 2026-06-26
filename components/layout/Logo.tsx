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
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label="Memebooq">
      {iconOnly ? (
        <img src="/logo-mark.png" alt="Memebooq" className="h-9 w-9 shrink-0" />
      ) : (
        <>
          <img src="/logo-mark.png" alt="" aria-hidden className="h-11 w-11 shrink-0" />
          <span className="font-display text-[1.8rem] font-bold leading-none tracking-[-0.05em] sm:text-[2rem]">
            <span className="text-text">meme</span>
            <span className="text-gold">booq</span>
          </span>
        </>
      )}
    </Link>
  );
}
