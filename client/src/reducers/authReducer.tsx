import { Action, State } from '../context/Auth';

export enum Actions {
  login = 'LOGIN',
  logout = 'LOGOUT',
  stop_loading = 'STOP_LOADING',
}

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
        wsInstance: null,
      };
    case Actions.stop_loading:
      return { ...state, loading: false };

    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export default reducer;
