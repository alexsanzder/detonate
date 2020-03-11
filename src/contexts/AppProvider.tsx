import * as React from "react";
import { ThemeProvider } from "./ThemeProvider";

export interface AppContextType {
  locale: string;
  running: boolean;
  toggleRunning(value: boolean): void;
  reload: boolean;
  toggleReload(value: boolean): void;
}

export const AppContext = React.createContext<AppContextType>({
  locale: "en-EN",
  running: false,
  toggleRunning: () => {},
  reload: false,
  toggleReload: () => {}
});

export const AppProvider: React.FC = (props: React.PropsWithChildren<{}>) => {
  const [running, setRunning] = React.useState(false);
  const [reload, setReload] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        locale: "de-DE",
        running: running,
        toggleRunning: setRunning,
        reload: reload,
        toggleReload: setReload
      }}
    >
      <ThemeProvider>{props.children}</ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
