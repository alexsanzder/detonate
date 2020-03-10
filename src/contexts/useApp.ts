import * as React from "react";

type ContextProps = {
  locale: string;
  running: boolean;
  toggleRunning: (state: boolean) => void;
  reload: boolean;
  toggleReload: () => void;
  range: string;
  toggleRange: (range: string) => void;
};

const AppContext = React.createContext<Partial<ContextProps>>({});

export default AppContext;
