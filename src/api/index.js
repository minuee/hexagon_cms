import axios from "axios";
import { store } from "redux/index";
import dayjs from "dayjs";

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
  // Common
  uploadImage: async ({ file, page }) => {
    try {
      let fileKey = `cms/${page}/${dayjs().unix()}_${file.name}`;
      let path = `https://hg-prod-file.s3.ap-northeast-1.amazonaws.com/public/${fileKey}`;

      let img_path = await axios.put(path, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return img_path;
    } catch (e) {
      console.log(e);
      return "";
    }
  },
  approveMember: async ({ member_pk }) => {
    try {
      console.log(member_pk);
      let response = await axios.patch(`/member/approval/${member_pk}`, {
        params: {},
      });
    } catch (e) {
      console.log(e);
    }
  },

  // Member
  getMemberList: async ({ page, paginate = 10, search_word, term_start, term_end, sort_item, sort_type }) => {
    try {
      let data = await axios.get("/member/list", {
        params: {
          page,
          paginate,
          search_word,
          term_start,
          term_end,
          sort_item,
          sort_type,
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
      ret.img_url = "/image/lisence_sample.png";

      return ret;
    } catch (e) {
      console.log(e);
      return {};
    }
  },
  getMemberRewardList: async ({ member_pk, page, paginate = 10 }) => {
    try {
      let data = await axios.get(`/member/reward/list/${member_pk}`, {
        params: { page, paginate },
      });

      let ret = data.data.data.userRewardHistory;
      // ret.forEach((item) => {
      //   item.reward_type = item.reward_type || "-";
      // });

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  updateMemberDetail: async ({ member_pk, grade_code, img_url, member_type }) => {
    try {
      let data = await axios.put(`/member/modify/${member_pk}`, { grade_code, img_url, member_type });
    } catch (e) {
      console.log(e);
    }
  },

  // Category
  getCategoryList: async ({ search_word, search_category }) => {
    try {
      let data = await axios.get("/category/list", {
        params: { search_word },
      });
      let ret = data.data.data.categoryList;

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  getCategoryDetail: async ({ category_pk }) => {
    try {
      let data = await axios.get(`/category/view/${category_pk}`, {
        params: {},
      });

      console.log(data);

      let ret = data.data.data.categoryDetail[0];
      // ret.img_url = "/image/lisence_sample.png";

      return ret;
    } catch (e) {
      console.log(e);
      return {};
    }
  },
  updateCategoryDetail: async ({ category_pk, category_name, category_logo, category_type }) => {
    try {
      let data = await axios.put(`/category/modify/${category_pk}`, { category_name, category_logo, category_type });
    } catch (e) {
      console.log(e);
    }
  },
};
