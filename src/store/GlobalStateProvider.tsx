import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import useGlobalState from './useGlobalState';

import Context from './context';

import { RecordType } from '../@types';

export interface GlobalStateType {
  timer: number;
  showEdit: boolean;
  isRunning: boolean;
  lastRecord: RecordType;
  editRecord: RecordType;
  profile: any;
  projects: any;
  range: string;
  records: RecordType[];
  start: number;
}

interface GlobalStateProviderProps {
  children: React.ReactNode;
  initialState: GlobalStateType;
}

const useGlobalStateProvider = ({
  initialState,
  children,
}: GlobalStateProviderProps): JSX.Element => {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    browser.storage.onChanged.addListener((items: any) => {
      setState({ ...state, ...items });
    });
  }, []);

  console.log('Context', state);

  return <Context.Provider value={useGlobalState(state)}>{children}</Context.Provider>;
};

export default useGlobalStateProvider;
