import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { GlobalStateType } from './GlobalStateProvider';
import { ContextType } from './context';
import { TOGGLE_EDIT } from './actions';

export interface Actions {
  type: string;
  payload?: { action: string; message?: any };
}

const reducer = (state: GlobalStateType, action: Actions): Promise<GlobalStateType> => {
  const { type, payload } = action;
  console.log('Actions', action);

  switch (type) {
    case 'SEND_MESSAGE':
      return browser.runtime
        .sendMessage(payload)
        .catch((error) => {
          console.error(error);
        })
        .then((response) => {
          return {
            ...state,
            ...response.payload,
          };
        });

    case TOGGLE_EDIT:
      return Promise.resolve({
        ...state,
        showEdit: !state.showEdit,
      });

    default:
      return Promise.resolve(state);
  }
};

const useGlobalState = (initialState: GlobalStateType): ContextType => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useGlobalState;
