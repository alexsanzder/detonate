import * as React from 'react';

import { Actions } from './useGlobalState';
import { GlobalStateType } from './GlobalStateProvider';

export interface ContextType {
  state: GlobalStateType;
  dispatch: React.Dispatch<Actions>;
}

const Context = React.createContext<ContextType>({
  state: null,
  dispatch: () => null,
});

export default Context;
