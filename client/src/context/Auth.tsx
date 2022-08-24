import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';

import { User } from '../../types';
import { Actions } from '../reducers/authReducer';
import reducer from '../reducers/authReducer';

export interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  wsConnection: WebSocket;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
  wsConnection: null,
});

const DispatchContext = createContext(null);

export interface Action {
  type: Actions;
  payload: any;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
    wsConnection: null,
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
