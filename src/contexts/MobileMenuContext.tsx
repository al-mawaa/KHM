import { createContext, useContext, ReactNode } from "react";

interface MobileMenuContextType {
  isMobileMenuOpen: boolean;
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  isMobileMenuOpen: false,
});

export function MobileMenuProvider({ children, isMobileMenuOpen }: { children: ReactNode; isMobileMenuOpen: boolean }) {
  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
