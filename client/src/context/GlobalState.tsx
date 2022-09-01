import { createContext, useContext, useReducer } from 'react';

import { Actions } from '../reducers/globalStateReducer';
import reducer from '../reducers/globalStateReducer';

export interface State {
  darkMode: boolean;
}

const StateContext = createContext<State>({
  darkMode: false,
});

const DispatchContext = createContext(null);

export interface Action {
  type: Actions;
}

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    darkMode: false,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useGlobalStateContext = () => {
  return useContext(StateContext);
};
export const useGlobalStateDispatch = () => {
  return useContext(DispatchContext);
};
