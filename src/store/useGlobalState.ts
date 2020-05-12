import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { GlobalStateType } from './GlobalStateProvider';
import { ContextType } from './context';
import { TOGGLE_EDIT } from './actions';

export interface Actions {
  type: string;
  payload?: any;
}

/**
 * SEND MESSAGE
 * send message to background.js
 */
const sendMessage = async (payload): Promise<any> => {
  const response = await browser.runtime.sendMessage(payload);
  // console.log(response);
  return response.payload;
};

const reducer = (state: GlobalStateType, action: Actions): GlobalStateType => {
  const { type, payload } = action;
  console.log('Actions', action);

  switch (type) {
    case 'SEND_MESSAGE':
      const response = sendMessage(payload);
      return {
        ...state,
        ...response,
      };

    case 'EDIT':
      return {
        ...state,
        showEdit: !state.showEdit,
        editRecord: payload.record,
      };

    case TOGGLE_EDIT:
      return {
        ...state,
        showEdit: !state.showEdit,
      };

    default:
      return state;
  }
};

const useGlobalState = (initialState: GlobalStateType): ContextType => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useGlobalState;
