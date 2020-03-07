import * as React from 'react';

type ContextProps = {
  locale: string;
  running: boolean;
  toggleRunning: () => void;
  reload: boolean;
  toggleReload: () => void;
};

const AppContext = React.createContext<Partial<ContextProps>>({});

export default AppContext;
