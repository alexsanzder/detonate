import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { ContextType } from './context';
import { SYNC, TOGGLE_EDIT, ADD_ROW, FINISH_ROW } from './actions';

export interface Actions {
  type: string;
  value?: any;
}

export interface GlobalStateProps {
  showEdit: boolean;
  isRunning: boolean;
}

export const initialState: GlobalStateProps = {
  showEdit: false,
  isRunning: false,
};

const sendMessage = async (action): Promise<void> => {
  const response = await browser.runtime.sendMessage(action);
  console.log('Sync response ', response);
};

const reducer = (
  state: GlobalStateProps,
  action: Actions,
): GlobalStateProps | Promise<GlobalStateProps> => {
  switch (action.type) {
    case SYNC:
      sendMessage(action).then((response) => response);
      return Promise.resolve(state);

    case TOGGLE_EDIT:
      return {
        ...state,
        showEdit: !state.showEdit,
      };

    default:
      return state;
  }
};

const useGlobalState = (): ContextType => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useGlobalState;
