import { Action, State } from '../context/GlobalState';

export enum ActionTypes {
  dark = 'DARK',
  light = 'LIGHT',
  showPopup = 'SHOW',
  hidePopup = 'HIDE',
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.dark:
      return {
        ...state,
        darkMode: true,
      };

    case ActionTypes.light:
      return {
        ...state,
        darkMode: false,
      };
    case ActionTypes.showPopup:
      return {
        ...state,
        popup: true,
        popupMessage: payload.message,
      };
    case ActionTypes.hidePopup:
      return {
        ...state,
        popup: false,
      };

    default:
      throw new Error(`Unknown action type : ${type}`);
  }
};

export default reducer;
