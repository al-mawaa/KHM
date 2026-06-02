import type { ReactNode } from "react";

import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="min-h-0 flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
