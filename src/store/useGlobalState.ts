import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { GlobalStateType } from './GlobalStateProvider';
import { ContextType } from './context';
import { SYNC, EDIT_RECORD, ADD_ROW, UPDATE_ROW, DELETE_ROW, FINISH_ROW } from './actions';
import { MessageType } from '../@types';

export interface Actions {
  type: string;
  payload?: any;
}

/**
 * SEND MESSAGE
 * send message to background.js
 */
const sendMessage = async (message: MessageType): Promise<any> => {
  const response = await browser.runtime.sendMessage(message);
  console.log(response);
  return Promise.resolve(response.payload);
};

const reducer = (state: GlobalStateType, action: Actions): GlobalStateType => {
  const { type, payload } = action;
  console.log('Actions', action);

  switch (type) {
    case SYNC:
      const message = {
        action: SYNC,
      };

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
      };

    case ADD_ROW: {
      const message = {
        action: ADD_ROW,
        message: payload,
      };
      // console.log('ADD_ROW', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
      };
    }

    case UPDATE_ROW: {
      const message = {
        action: UPDATE_ROW,
        message: payload,
      };
      // console.log('UPDATE_ROW', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
      };
    }

    case FINISH_ROW: {
      const message = {
        action: FINISH_ROW,
        message: payload,
      };
      // console.log('FINISH_ROW', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
      };
    }

    case DELETE_ROW: {
      const message = {
        action: DELETE_ROW,
        message: payload,
      };
      // console.log('DELETE_ROW', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
      };
    }

    case EDIT_RECORD:
      return {
        ...state,
        showEdit: payload.showEdit,
        editRecord: payload.record,
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
