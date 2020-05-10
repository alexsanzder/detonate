import * as React from 'react';
import { initialState, GlobalStateProps, Actions } from './useGlobalState';

export interface ContextType {
  state: GlobalStateProps;
  dispatch: React.Dispatch<Actions>;
}

const Context = React.createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

export default Context;
