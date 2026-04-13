import { createContext, useContext } from "react";

export const BREAKPOINT_OPTIONS = [
  { key: "desktop", label: "Desktop", width: "100%" },
  { key: "tablet", label: "Tablet", width: 900 },
  { key: "mobile", label: "Mobile", width: 420 },
];

const BreakpointContext = createContext({
  activeBreakpoint: "desktop",
  setActiveBreakpoint: () => {},
});

export function BreakpointProvider({ value, children }) {
  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpoint() {
  return useContext(BreakpointContext);
}
