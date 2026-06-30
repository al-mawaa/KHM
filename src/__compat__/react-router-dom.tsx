"use client";

import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/router";
import { useEffect } from "react";

type LinkProps = {
  to: string;
  children?: React.ReactNode;
  className?: string;
  replace?: boolean;
  target?: string;
  prefetch?: boolean;
  [key: string]: any;
};

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Routes({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Route({ element, children }: { element?: React.ReactNode; children?: React.ReactNode }) {
  return <>{element ?? children}</>;
}

export function Outlet() {
  return null;
}

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />;
}

export function NavLink({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useNextRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, replace, to]);

  return null;
}

export function useNavigate() {
  const router = useNextRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const router = useNextRouter();
  const asPath = router.asPath ?? "/";
  const [pathnamePart, searchPart] = asPath.split("?");
  const [pathnameWithoutHash, hashPart] = pathnamePart.split("#");

  return {
    pathname: pathnameWithoutHash || "/",
    search: searchPart ? `?${searchPart}` : "",
    hash: hashPart ? `#${hashPart}` : "",
    state: null,
  };
}
