import * as React from 'react';

import useGlobalState from './useGlobalState';

import Context from './context';

import { RecordType } from '../@types';

export interface GlobalStateType {
  timer: number;
  showEdit: boolean;
  isRunning: boolean;
  lastRecord: RecordType;
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
  return <Context.Provider value={useGlobalState(initialState)}>{children}</Context.Provider>;
};

export default useGlobalStateProvider;
