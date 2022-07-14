import { createContext, useContext, useReducer } from 'react';

import { User, Actions } from '../../types';

interface State {
  authenticated: boolean;
  user: User | undefined;
}

interface Action {
  type: Actions;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case Actions.login:
      return {
        ...state,
        authenticated: true,
        user: payload,
      };

    case Actions.logout:
      return {
        ...state,
        authenticated: false,
        user: null,
      };

    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => {
  return useContext(StateContext);
};
export const useAuthDispatch = () => {
  return useContext(DispatchContext);
};
