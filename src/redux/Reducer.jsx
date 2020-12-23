import { CurrentAuthUiState, UserState } from "@psyrenpark/auth";

const INITIAL_STATE = {
  isLoading: false,
  userState: UserState.NOT_SIGN, // 인증 상태

  tmp_signed: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: payload };

    default:
      return state;
  }
};
