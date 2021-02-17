const INITIAL_STATE = {
  isLoading: false,
  // userState: 'NOT_SIGN',
  userState: "SIGNED",

  isSalesman: false,
  member: {},
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: payload };
    case "SIGN_IN":
      return { ...state, userState: "SIGNED" };
    case "SIGN_OUT":
      return { ...state, userState: "NOT_SIGN" };
    case "SET_IS_SALESMAN":
      return { ...state, isSalesman: payload };
    case "SET_MEMBER":
      return { ...state, member: payload };

    default:
      return state;
  }
};
