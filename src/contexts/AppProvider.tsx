import * as React from "react";
import { ThemeProvider } from "./ThemeProvider";

export interface AppContextType {
  locale: string;
  running: boolean;
  toggleRunning(value: boolean): void;
  reload: boolean;
  toggleReload(value: boolean): void;
  range: string;
  toggleRange(value: string): void;
}

export const AppContext = React.createContext<AppContextType>({
  locale: "en-EN",
  running: false,
  toggleRunning: () => {},
  reload: false,
  toggleReload: () => {},
  range: "A1:G1",
  toggleRange: () => {}
});

export const AppProvider: React.FC = (props: React.PropsWithChildren<{}>) => {
  const [running, setRunning] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [range, setRange] = React.useState("");

  return (
    <AppContext.Provider
      value={{
        locale: "de-DE",
        running: running,
        toggleRunning: setRunning,
        reload: reload,
        toggleReload: setReload,
        range: range,
        toggleRange: setRange
      }}
    >
      <ThemeProvider>{props.children}</ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
