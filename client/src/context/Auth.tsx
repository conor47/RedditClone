import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';

import { User, Actions } from '../../types';

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: Actions;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case Actions.login:
      return {
        ...state,
        authenticated: true,
        user: payload,
        loading: false,
      };

    case Actions.logout:
      return {
        ...state,
        authenticated: false,
        user: null,
        loading: true,
      };
    case Actions.stop_loading:
      return { ...state, loading: false };

    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get('/auth/me ');
        dispatch({ type: Actions.login, payload: res.data });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: Actions.stop_loading, payload: {} });
      }
    }
    loadUser();
  }, []);

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
