import { Action, State } from '../context/GlobalState';

export enum Actions {
  dark = 'DARK',
  light = 'LIGHT',
}

const reducer = (state: State, { type }: Action) => {
  switch (type) {
    case Actions.dark:
      return {
        ...state,
        darkMode: true,
      };

    case Actions.light:
      return {
        ...state,
        darkMode: false,
      };
    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export default reducer;
