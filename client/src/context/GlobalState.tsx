import { createContext, useContext, useReducer } from 'react';

import { ActionTypes } from '../reducers/globalStateReducer';
import reducer from '../reducers/globalStateReducer';

export interface State {
  darkMode: boolean;
  popup: boolean;
  popupMessage: string;
  showPopup?: (message: string) => void;
}

const StateContext = createContext<State>({
  darkMode: false,
  popup: false,
  popupMessage: '',
});

const DispatchContext = createContext(null);

export interface Action {
  type: ActionTypes;
  payload: any;
}

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    darkMode: false,
    popup: false,
    popupMessage: '',
  });

  const showPopup = (message: string) => {
    dispatch({ type: ActionTypes.showPopup, payload: { message } });
    setTimeout(() => {
      dispatch({ type: ActionTypes.hidePopup, payload: { message } });
    }, 2000);
  };

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={{ ...state, showPopup }}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useGlobalStateContext = () => {
  return useContext(StateContext);
};
export const useGlobalStateDispatch = () => {
  return useContext(DispatchContext);
};
