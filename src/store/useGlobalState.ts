import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { RecordType } from '../@types';
import { GlobalStateType } from './GlobalStateProvider';
import { ContextType } from './context';
import { SYNC, TOGGLE_EDIT, ADD_ROW, FINISH_ROW, UPDATE_ROW } from './actions';

export interface Actions {
  type: string;
  payload?: any;
}

const sendMessage = async (action: Actions): Promise<any> => {
  return await browser.runtime.sendMessage(action);
};

const reducer = async (state: GlobalStateType, action: Actions): Promise<GlobalStateType> => {
  switch (action.type) {
    case SYNC:
      (async (): Promise<GlobalStateType> => {
        const response = await sendMessage(action);
        return state;
      })();
      return state;

    case ADD_ROW:
      const response = await browser.runtime.sendMessage(action);
      console.log(response);
      return {
        ...state,
        ...response,
      };

    case UPDATE_ROW:
      (async (): Promise<GlobalStateType> => {
        const response = await sendMessage(action);
        return {
          ...state,
          lastRecord: response.payload.record,
        };
      })();
      return state;

    case FINISH_ROW:
      (async (): Promise<GlobalStateType> => {
        const response = await sendMessage(action);
        console.log('FINISH_ROW', response);
        return {
          ...state,
          ...response,
        };
      })();
      return state;

    case 'LAST_RECORD':
      return {
        ...state,
        lastRecord: action.payload,
      };

    case 'TOGGLE_RUNNING':
      return {
        ...state,
        isRunning: !state.isRunning,
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
