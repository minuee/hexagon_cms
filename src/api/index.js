import axios from "axios";
import { store } from "redux/index";

// let token = localStorage.getItem("token");
// axios.defaults.headers.common.Authorization = token;
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

//  const instance = axios.create({
//      baseURL: "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage/cms",
//  })

axios.defaults.baseURL = "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage/cms";

axios.interceptors.request.use(
  function (config) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: true,
    });
    return config;
  },
  function (error) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: false,
    });
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  function (response) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: false,
    });
    return response;
  },

  function (error) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: false,
    });
    return Promise.reject(error);
  },
);

export const apiObject = {
  // Member
  getMemberList: async ({ page, paginate = 10, search_word, term_start, term_end, order_type }) => {
    try {
      let data = await axios.get("/member/list", {
        params: {
          page,
          paginate,
          search_word,
          term_start,
          term_end,
          order_type,
        },
      });
      let ret = data.data.data.userList;

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  getMemberDetail: async ({ member_pk }) => {
    try {
      let data = await axios.get(`/member/view/${member_pk}`, {
        params: {},
      });
      let ret = data.data.data.userDetail[0];

      return ret;
    } catch (e) {
      console.log(e);
      return {};
    }
  },
};
