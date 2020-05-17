import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { GlobalStateType } from './GlobalStateProvider';
import { ContextType } from './context';
import {
  SYNC,
  ADD_RECORD,
  STOP_RECORD,
  EDIT_RECORD,
  DELETE_RECORD,
  SHOW_EDIT,
  ADD_ROW,
  UPDATE_ROW,
  DELETE_ROW,
} from './actions';
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

    case ADD_RECORD: {
      const message = {
        action: ADD_ROW,
        message: payload,
      };
      console.log('ADD_RECORD', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
        showEditRunning: false,
      };
    }

    case STOP_RECORD: {
      const message = {
        action: STOP_RECORD,
        message: payload,
      };
      // console.log('STOP_RECORD', message);

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
        showEditRunning: false,
      };
    }

    case EDIT_RECORD: {
      const message = {
        action: UPDATE_ROW,
        message: payload,
      };

      const response = sendMessage(message);
      return {
        ...state,
        ...response,
        showEdit: false,
        showEditRunning: false,
      };
    }

    case DELETE_RECORD: {
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
        showEditRunning: false,
        start: payload.timer ? 0 : state.start,
        isRunning: payload.timer ? false : state.isRunning,
        runningRecord: payload.timer ? null : state.runningRecord,
      };
    }

    case SHOW_EDIT: {
      return {
        ...state,
        ...payload,
      };
    }

    default:
      return state;
  }
};

const useGlobalState = (initialState: GlobalStateType): ContextType => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useGlobalState;
