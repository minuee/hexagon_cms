import { CurrentAuthUiState, UserState } from "@psyrenpark/auth";

const INITIAL_STATE = {
  isLoading: false,
  // userState: UserState.NOT_SIGN,
  userState: UserState.SIGNED,
  isSalesman: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: payload };
    case "SIGN_IN":
      return { ...state, userState: UserState.SIGNED };
    case "SIGN_OUT":
      return { ...state, userState: UserState.NOT_SIGN };
    case "SET_IS_SALESMAN":
      return { ...state, isSalesman: payload };

    default:
      return state;
  }
};
