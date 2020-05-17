import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import useGlobalState from './useGlobalState';

import Context from './context';

import { RecordType } from '../@types';

export interface StorageStateType {
  isRunning: boolean;
  profile: any;
  projects: any;
  range: string;
  records: RecordType[];
  start: number;
}
export interface GlobalStateType extends StorageStateType {
  timer: number;
  showEdit: boolean;
  showEditRunning: boolean;
  runningRecord: RecordType;
  editRecord: RecordType;
}

interface GlobalStateProviderProps {
  children: React.ReactNode;
  initialState: GlobalStateType;
}

const useGlobalStateProvider = ({
  initialState,
  children,
}: GlobalStateProviderProps): JSX.Element => {
  const [state, setState] = React.useState({ ...initialState, showEdit: false });

  React.useEffect(() => {
    browser.storage.onChanged.addListener((items: any) => {
      setState({ ...state, ...items });
    });
  }, []);

  return <Context.Provider value={useGlobalState(state)}>{children}</Context.Provider>;
};

export default useGlobalStateProvider;
