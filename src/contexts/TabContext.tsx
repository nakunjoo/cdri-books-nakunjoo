import { createContext, useContext, useState, type ReactNode } from "react";

type Tab = "search" | "like";

type TabContextType = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

const defaultValue: TabContextType = {
  tab: "search",
  setTab: () => {},
};

const TabContext = createContext<TabContextType>(defaultValue);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>("search");

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTab() {
  const context = useContext(TabContext);
  return context;
}
