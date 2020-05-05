import * as React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { RecordType } from "../hooks/useGoogle";

export const defaultRecord = {
  id: "",
  name: "",
  date: "",
  description: "",
  company: "",
  project: "",
  ticket: "",
  time: 0
};
export interface AppContextType {
  locale: string;
  running: boolean;
  toggleRunning(value: boolean): void;
  reload: boolean;
  toggleReload(value: boolean): void;
  record: RecordType;
  setRecord(defaultRecord: RecordType): void;
}

export const AppContext = React.createContext<AppContextType>({
  locale: "en-EN",
  running: false,
  toggleRunning: () => {},
  reload: false,
  toggleReload: () => {},
  record: defaultRecord,
  setRecord: () => {}
});

export const AppProvider: React.FC = (props: React.PropsWithChildren<{}>) => {
  const [running, setRunning] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<RecordType>(
    defaultRecord
  );

  return (
    <AppContext.Provider
      value={{
        locale: "de-DE",
        running: running,
        toggleRunning: setRunning,
        reload: reload,
        toggleReload: setReload,
        record: activeRecord,
        setRecord: setActiveRecord
      }}
    >
      <ThemeProvider>{props.children}</ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
