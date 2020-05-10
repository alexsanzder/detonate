import * as React from 'react';
import { ContextType } from './context';
import { TOGGLE_EDIT, ADD_ROW, FINISH_ROW } from './actions';

export interface Actions {
  type: string;
  value?: any;
}

export interface GlobalStateProps {
  showEdit: boolean;
}

export const initialState: GlobalStateProps = {
  showEdit: false,
};

const reducer: React.Reducer<GlobalStateProps, Actions> = (state, action) => {
  switch (action.type) {
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
