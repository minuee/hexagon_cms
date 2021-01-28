import axios from "axios";
import { store } from "redux/index";
import { encrypt, decrypt, getFullImgURL } from "common";
import dayjs from "dayjs";
import _ from "lodash";

let token = localStorage.hexagon_cms_token;
axios.defaults.headers.common.Authorization = token;
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

//  const instance = axios.create({
//  baseURL: "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage/cms",
//  })

axios.defaults.baseURL = "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage";

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

    if (response.data.code === "1024") {
      alert("인증이 만료되어 로그인 페이지로 이동합니다");
      store.dispatch({
        type: "SIGN_OUT",
      });
    }

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
  uploadImageSingle: async ({ img, page }) => {
    try {
      if (!img?.file) return img?.path;

      let formData = new FormData();
      formData.append("img", img.file);
      formData.append("folder", page);

      let response = await axios.post("/v1/img/single", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      let ret = response.data.data;

      return ret;
    } catch (e) {
      console.log({ e });
      return "";
    }
  },
  uploadImageMultiple: async ({ img_arr, page }) => {
    try {
      if (!img_arr.length) return [];

      let ret = [];

      let formData = new FormData();
      formData.append("folder", page);

      img_arr.forEach((item) => {
        if (item.file) {
          formData.append("img", item.file);
        } else {
          ret.push(item.path);
        }
      });

      if (formData.get("img")) {
        let response = await axios.post("/v1/img/multiple", formData, {
          headers: { "content-type": "multipart/form-data" },
        });

        for (let i = 0; i < response.data.data.length; i++) {
          if (i % 2) {
            ret.push(response.data.data[i]);
          }
        }
      }

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },

  // Auth
  signIn: async ({ user_id = "superbinder", password = "hexagon12!@" }) => {
    try {
      let data = await axios.post("/v1/auth/signin", {
        user_id,
        password,
      });

      return data.data.token;
    } catch (e) {
      console.log({ e });
    }
  },

  // Member
  getMemberList: async ({ page = 1, paginate = 10, search_word, term_start, term_end, sort_item, sort_type }) => {
    try {
      let data = await axios.get("/cms/member/list", {
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
      ret.forEach((item) => {
        item.email = decrypt(item.email);
        item.phone = decrypt(item.phone);
      });

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  approveMembers: async ({ member_array }) => {
    try {
      let response = await axios.put(`/cms/member/approval`, {
        member_array,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  getMemberDetail: async ({ member_pk }) => {
    try {
      let data = await axios.get(`/cms/member/view/${member_pk}`, {});

      let ret = data.data.data.userDetail;

      // ret.img_url = getFullImgURL(ret.img_url);
      ret.email = decrypt(ret.email);
      ret.phone = decrypt(ret.phone);

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  getMemberRewardList: async ({ member_pk, page, paginate = 10 }) => {
    try {
      let data = await axios.get(`/cms/member/reward/list/${member_pk}`, {
        params: { page, paginate },
      });

      let ret = data.data.data.userRewardHistory;
      // ret.forEach((item) => {
      //   item.reward_type = item.reward_type || "-";
      // });

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  updateMemberDetail: async ({ member_pk, grade_code, img_url, member_type }) => {
    try {
      let response = await axios.put(`/cms/member/modify/${member_pk}`, {
        grade_code,
        img_url,
        member_type,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },

  // Category
  getCategoryList: async ({ search_word }) => {
    try {
      let data = await axios.get("/cms/category/list", {
        params: { search_word },
      });
      let ret = data.data.data;

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  removeCategorys: async ({ category_array }) => {
    try {
      let response = await axios.delete(`/cms/category/remove/`, {
        data: {
          category_array,
        },
      });

      return response;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  getCategoryDetail: async ({ category_pk, category_type }) => {
    try {
      let data = await axios.get(`/cms/category/view/${category_pk}`, {
        params: { category_type },
      });

      let ret = data.data.data.categoryDetail;

      console.log(ret);
      if (ret.category_type === "N") {
        for (let i = 1; i <= 3; i++) {
          ret[`d${i}`] = ret[`depth${i}code`];
        }
      }

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  getNormalCategoryList: async () => {
    try {
      let data = await axios.get("/cms/category/depth/list", {});

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

      console.log(ret);
      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },

  registCategory: async ({ category_name, category_logo, category_seq = 1, category_type, normalcategory_pk }) => {
    try {
      let response = await axios.post("/cms/category/regist", {
        category_name,
        category_logo,
        category_seq,
        category_type,
        normalcategory_pk,
      });

      return response;
    } catch (e) {
      console.log({ e });
      return "";
    }
  },
  updateCategoryDetail: async ({
    category_pk,
    category_name,
    category_logo,
    category_seq = 1,
    category_type,
    category_yn = true,
    normalcategory_pk,
  }) => {
    try {
      let data = await axios.put(`/cms/category/modify/${category_pk}`, {
        category_name,
        category_logo,
        category_type,
        category_seq,
        category_yn,
        normalcategory_pk,
      });
    } catch (e) {
      console.log({ e });
    }
  },

  // Item
  getItemList: async ({ category_pk, page, paginate = 10, search_word }) => {
    try {
      let data = await axios.get("/cms/product/list", {
        params: { category_pk, page, paginate, search_word },
      });

      let ret = data.data.data.productList;

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getItemDetail: async ({ product_pk }) => {
    try {
      let data = await axios.get(`/cms/product/view/${product_pk}`, {});
      let ret = data.data.data.productDetail;

      ret.thumb_img = [{ file: null, path: ret.thumb_img }];
      ret.detail_img = [];
      for (let i = 1; i <= 4; i++) {
        if (ret[`detail_img${i}`] === null) break;
        ret.detail_img.push({ file: null, path: ret[`detail_img${i}`] });
      }

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  removeItems: async ({ product_array }) => {
    try {
      let response = await axios.delete("/cms/product/remove", {
        data: { product_array },
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  registItem: async (form) => {
    try {
      let thumb_img_path = await apiObject.uploadImageSingle({ img: form.thumb_img?.[0], page: "product" });
      form.thumb_img = thumb_img_path;

      let detail_img_paths = await apiObject.uploadImageMultiple({ img_arr: form.detail_img, page: "product" });
      for (let i = 0; i < detail_img_paths.length; i++) {
        form[`detail_img${i + 1}`] = detail_img_paths[i];
      }

      let response = await axios.post("/cms/product/regist", {
        ...form,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  updateItem: async ({ form, product_pk }) => {
    try {
      let thumb_img_path = await apiObject.uploadImageSingle({ img: form.thumb_img?.[0], page: "product" });
      form.thumb_img = thumb_img_path;

      let detail_img_paths = await apiObject.uploadImageMultiple({ img_arr: form.detail_img, page: "product" });
      for (let i = 0; i < detail_img_paths.length; i++) {
        form[`detail_img${i + 1}`] = detail_img_paths[i];
      }

      let response = await axios.put(`/cms/product/modify/${product_pk}`, {
        ...form,
      });
      return response;
    } catch (e) {
      console.log({ e });
    }
  },
};
