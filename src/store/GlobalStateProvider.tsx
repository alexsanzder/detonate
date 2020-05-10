import * as React from 'react';
import useGlobalState from './useGlobalState';
import Context from './context';

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

const useGlobalStateProvider = ({ children }: GlobalStateProviderProps): JSX.Element => (
  <Context.Provider value={useGlobalState()}>{children}</Context.Provider>
);

export default useGlobalStateProvider;
