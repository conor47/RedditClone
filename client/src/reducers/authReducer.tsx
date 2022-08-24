import { Action, State } from '../context/Auth';

export enum Actions {
  login = 'LOGIN',
  logout = 'LOGOUT',
  stop_loading = 'STOP_LOADING',
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case Actions.login:
      let wsInstance = null;
      wsInstance = new WebSocket('ws://127.0.0.1:5001/foo');
      return {
        ...state,
        authenticated: true,
        user: payload,
        loading: false,
        wsInstance,
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

export default reducer;
