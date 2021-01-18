import axios from "axios";
import { store } from "redux/index";
import dayjs from "dayjs";
import _ from "lodash";

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
  uploadImage: async ({ img }) => {
    console.log(img);
    try {
      let img_path = await axios.post(
        "/v1/img/single",
        { img: img },
        {
          header: { "content-type": img.type },
        },
      );

      return img_path;
    } catch (e) {
      console.log(e);
      return "";
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
  approveMembers: async ({ member_array }) => {
    try {
      let response = await axios.put(`/member/approval`, {
        member_array,
      });

      return response;
    } catch (e) {
      console.log(e);
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
  getCategoryList: async ({ search_word }) => {
    try {
      let data = await axios.get("/category/list", {
        params: { search_word },
      });
      let ret = data.data.data;

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  removeCategorys: async ({ category_array }) => {
    try {
      let response = await axios.delete(`/category/remove/`, {
        data: {
          category_array,
        },
      });

      return response;
    } catch (e) {
      console.log(e);
      return {};
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
  getNormalCategoryList: async () => {
    try {
      let data = await axios.get("/category/depth/list", {});

      let ret = {
        d1: [],
        d2: {},
        d3: {},
      };

      data.data.data.categoryDepthList.forEach((item) => {
        if (item.depth === 1) {
          // d1
          ret.d1.push(item);
        } else if (item.depth === 2) {
          // d2
          if (_.has(ret.d2, item.group_code)) {
            ret.d2[item.group_code].push(item);
          } else {
            ret.d2[item.group_code] = [item];
          }
        } else {
          // d3
          if (_.has(ret.d3, item.group_code)) {
            ret.d3[item.group_code].push(item);
          } else {
            ret.d3[item.group_code] = [item];
          }
        }
      });

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },

  registCategory: async ({ category_name, category_logo, category_seq = 1, category_type, normalcategory_pk }) => {
    try {
      let response = await axios.post("/category/regist", {
        category_name,
        category_logo,
        category_seq,
        category_type,
        normalcategory_pk,
      });

      return response;
    } catch (e) {
      console.log(e);
      return "";
    }
  },
  updateCategoryDetail: async ({ category_pk, category_name, category_logo, category_type }) => {
    try {
      let data = await axios.put(`/category/modify/${category_pk}`, { category_name, category_logo, category_type });
    } catch (e) {
      console.log(e);
    }
  },

  // Item
  getItemList: async ({ category_pk, page, paginate = 10, search_word }) => {
    try {
      let data = await axios.get("/product/list", {
        params: { category_pk, page, paginate, search_word },
      });
      let ret = data.data.data.productList;

      return ret;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
};
