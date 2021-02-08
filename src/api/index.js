import axios from "axios";
import { store } from "redux/index";
import { encrypt, decrypt, getFullImgURL } from "common";
import dayjs from "dayjs";
import _ from "lodash";

// let token = localStorage.hexagon_cms_token;
axios.defaults.headers.common.Authorization = localStorage.hexagon_cms_token;
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
  signIn: async ({ user_id = "superbinder", password = "hexagon12!@" }) => {
    try {
      let response = await axios.post("/v1/auth/signin", {
        user_id,
        password,
      });

      axios.defaults.headers.common.Authorization = response.data.token;
      return response.data;
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
  removeCategories: async ({ category_array }) => {
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
      let response = await axios.put(`/cms/category/modify/${category_pk}`, {
        category_name,
        category_logo,
        category_type,
        category_seq,
        category_yn,
        normalcategory_pk,
      });
      return response;
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
      let response = await axios.put(`/cms/product/modify/${product_pk}`, {
        ...form,
      });
      return response;
    } catch (e) {
      console.log({ e });
    }
  },

  // Event
  getEventList: async ({ page, paginate = 10, search_word }) => {
    try {
      let data = await axios.get("/cms/event/list", {
        params: { page, paginate, search_word },
      });

      let ret = data.data.data.eventList;
      ret.forEach((item) => {
        switch (item.event_gubun) {
          case "LIMIT":
            item.event_gubun_text = "한정특가";
            break;
          case "TERM":
            item.event_gubun_text = "기간할인이벤트";
            break;
          case "SALE":
            item.event_gubun_text = "할인이벤트";
            break;
          default:
            item.event_gubun_text = "이벤트 타입 오류";
        }
      });

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getEventDetail: async ({ event_pk }) => {
    try {
      let data = await axios.get(`/cms/event/view/${event_pk}`, {});
      let ret = data.data.data.eventDetail;

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  registEvent: async ({ event_gubun, start_dt, end_dt, title, product }) => {
    try {
      let response = await axios.post(`/cms/event/regist`, {
        event_gubun,
        start_dt,
        end_dt,
        title,
        product,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  modifyEvent: async ({ event_pk, event_gubun, start_dt, end_dt, title, product }) => {
    try {
      let response = await axios.put(`/cms/event/modify/${event_pk}`, {
        event_gubun,
        start_dt,
        end_dt,
        title,
        product,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  removeEvent: async ({ event_pk }) => {
    try {
      let response = await axios.delete(`/cms/event/remove/${event_pk}`);
      return response;
    } catch (e) {
      console.log({ e });
    }
  },

  // Notice
  getNoticeList: async ({ page, search_word, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/notice/list", {
        params: {
          page,
          search_word,
          paginate,
        },
      });
      let ret = data.data.data.noticeList;

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getNoticeDetail: async ({ notice_pk }) => {
    try {
      let data = await axios.get(`/cms/notice/view/${notice_pk}`);
      let ret = data.data.data.noticeDetail;

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  registNotice: async ({ title, content, start_dt, img_url, send_push }) => {
    try {
      let response = await axios.post("/cms/notice/regist", {
        title,
        content,
        start_dt,
        img_url,
        send_push,
      });
    } catch (e) {
      console.log({ e });
    }
  },
  updateNotice: async ({ notice_pk, title, content, start_dt, img_url, send_push }) => {
    try {
      let response = await axios.put(`/cms/notice/modify/${notice_pk}`, {
        title,
        content,
        start_dt,
        img_url,
        send_push,
      });
      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  removeNotice: async ({ notice_pk }) => {
    try {
      let response = await axios.delete(`/cms/notice/remove/${notice_pk}`);
      return response;
    } catch (e) {
      console.log({ e });
    }
  },

  // Banner
  getBannerList: async ({ page = 1, search_word, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/banner/list", {
        params: {
          page,
          search_word,
          paginate,
        },
      });
      let ret = data.data.data.bannerList;

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getBannerDetail: async ({ banner_pk }) => {
    try {
      let data = await axios.get(`/cms/banner/view/${banner_pk}`);
      let ret = data.data.data.bannerDetail;

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  registBanner: async ({ banner_type, img_url, title, content }) => {
    try {
      let response = await axios.post("/cms/banner/regist", {
        banner_type,
        img_url,
        title,
        content,
      });
      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  updateBanner: async ({ banner_pk, banner_type, img_url, title, content }) => {
    try {
      let response = await axios.put(`/cms/banner/modify/${banner_pk}`, {
        banner_type,
        img_url,
        title,
        content,
      });
      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  removeBanner: async ({ banner_pk }) => {
    try {
      let response = await axios.delete(`/cms/banner/remove/${banner_pk}`);
      return response;
    } catch (e) {
      console.log({ e });
    }
  },

  // Coupon
  getValidCouponList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get(`/cms/coupon/list/ing`, {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.validCouponList;

      ret.forEach((item) => {
        item.coupon_type = item.price;
      });

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getPassCouponList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get(`/cms/coupon/list/old`, {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.passCouponList;

      ret.forEach((item) => {
        item.coupon_type = item.price;
      });

      return ret;
    } catch (e) {
      console.log({ e });
      return [];
    }
  },
  getCouponDetail: async ({ coupon_pk }) => {
    try {
      let data = await axios.get(`/cms/coupon/view/${coupon_pk}`);
      let ret = data.data.data.couponDetail;

      ret.coupon_type = ret.price;

      return ret;
    } catch (e) {
      console.log({ e });
      return {};
    }
  },
  registCoupon: async ({ coupon_type, price, end_dt, target_array, issue_reason, is_first }) => {
    try {
      let response = await axios.post("/cms/coupon/regist", {
        coupon_type,
        price,
        end_dt,
        target_array,
        issue_reason,
        is_first,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  modifyCoupon: async ({ coupon_pk, coupon_type, price, end_dt, member_pk, update_reason, is_first }) => {
    try {
      let response = await axios.put(`/cms/coupon/modify/${coupon_pk}`, {
        coupon_type,
        price,
        end_dt,
        member_pk,
        update_reason,
        is_first,
      });

      return response;
    } catch (e) {
      console.log({ e });
    }
  },
  removeCoupon: async ({ coupon_pk }) => {
    try {
      let response = await axios.delete(`/cms/coupon/remove/${coupon_pk}`);
      return response;
    } catch (e) {
      console.log({ e });
    }
  },
};
