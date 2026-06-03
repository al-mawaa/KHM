import { Link } from "react-router-dom";

import { LOGO_ALT, LOGO_PNG } from "@/lib/logo";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  /** White card behind the PNG — helps on dark/colored headers */
  withBackground?: boolean;
};

export function BrandLogo({ className, imageClassName, withBackground = false }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        withBackground && "rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-slate-900/10",
      )}
    >
      <img
        src={LOGO_PNG}
        alt={LOGO_ALT}
        width={400}
        height={120}
        decoding="async"
        className={cn(
          "h-12 w-auto max-w-[min(100%,320px)] object-contain object-left",
          imageClassName,
          className,
        )}
      />
    </span>
  );
}

export function BrandLogoLink({
  className,
  imageClassName,
  withBackground = false,
  onClick,
  to = "/",
}: BrandLogoProps & { onClick?: () => void; to?: string }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn("inline-flex shrink-0 focus:outline-none focus:ring-2 focus:ring-aqua/60", className)}
      aria-label={`${LOGO_ALT} — Home`}
    >
      <BrandLogo imageClassName={imageClassName} withBackground={withBackground} />
    </Link>
  );
}
