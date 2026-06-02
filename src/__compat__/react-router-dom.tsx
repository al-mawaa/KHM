"use client";

import NextLink from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const router = useRouter();

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
  const router = useRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  return {
    pathname,
    search: searchParams ? `?${searchParams.toString()}` : "",
    hash: "",
    state: null,
  };
}
