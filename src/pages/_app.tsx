"use client";

import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";

import PublicLayout from "@/layouts/PublicLayout";
import "@/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <Component {...pageProps} />;
  }

  return (
    <PublicLayout>
      <Component {...pageProps} />
    </PublicLayout>
  );
}
