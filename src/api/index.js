import axios from "axios";
import { store } from "redux/index";
import { encrypt, decrypt, getListIndex, getFullImgURL } from "common";

// let token = localStorage.hexagon_cms_token;
axios.defaults.headers.common.Authorization = localStorage.hexagon_cms_token;
// axios.defaults.headers.common["Cache-control"] = "no-cache";
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

//  const instance = axios.create({
//  baseURL: "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage/cms",
//  })

axios.defaults.baseURL = "https://b2e4ceh3wj.execute-api.ap-northeast-1.amazonaws.com/hax-prod-api-stage";

axios.interceptors.request.use(
  function(config) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: true,
    });
    return config;
  },
  function(error) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: false,
    });
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  function(response) {
    store.dispatch({
      type: "SET_IS_LOADING",
      payload: false,
    });

    if (response.data.code === "1024" || response.data.code === "1025") {
      alert("인증이 만료되어 로그인 페이지로 이동합니다");

      store.dispatch({ type: "SIGN_OUT" });
      localStorage.removeItem("hexagon_cms_token");

      return new Promise(() => {});
    }

    return response;
  },

  function(error) {
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  sendPushMessage: async ({ title, comment, routeName, routeIdx, img_url }) => {
    try {
      let response = await axios.post(`/cms/pushsend`, {
        title,
        comment,
        routeName,
        routeIdx,
        img_url,
      });

      alert("알림을 발송했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  getExcelLink: async ({ path, query, params }) => {
    try {
      let response = await axios.get(`/cms/${path}/list`, {
        params: {
          is_excel: true,
          ...query,
          ...params,
        },
      });
      let ret = response.data.url;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Home
  getAnalisysData: async ({ member_pk = 1 }) => {
    try {
      let data = await axios.get(`/cms/home/analyst/${member_pk}`);
      let ret = data.data.data;

      ret.rank_data?.forEach((item, index) => {
        item.no = index + 1;
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getSalesmanAnalisysData: async ({ special_code }) => {
    try {
      let data = await axios.get(`/cms/salesman/home/analyst/${special_code}`);
      let ret = data.data.data;

      ret.rank_data?.forEach((item, index) => {
        item.no = index + 1;
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },

  // Member
  getMemberList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    is_approval,
  }) => {
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
          is_approval,
        },
      });
      let ret = data.data.data.userList;

      ret.forEach((item) => {
        item.email = decrypt(item.email);
        item.phone = decrypt(item.phone);
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  approveMembers: async ({ member_array }) => {
    try {
      let response = await axios.put(`/cms/member/approval`, {
        member_array,
      });

      alert("회원가입 승인을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  getMemberDetail: async ({ member_pk }) => {
    try {
      let data = await axios.get(`/cms/member/view/${member_pk}`, {});
      let ret = data.data.data.userDetail;

      ret.email = decrypt(ret.email);
      ret.phone = decrypt(ret.phone);

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getMemberRewardList: async ({ member_pk, page = 1, paginate = 10 }) => {
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getMemberOrderList: async ({ member_pk, page = 1, paginate = 10 }) => {
    try {
      let data = await axios.get(`/v1/order/list/${member_pk}`, {
        params: { page, paginate },
      });

      let ret = data.data.data.orderList;
      // ret.forEach((item) => {
      //   item.reward_type = item.reward_type || "-";
      // });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  modifyMember: async ({
    member_pk,
    company_type,
    company_class,
    company_address,
    company_zipcode,
    company_ceo,
    company_phone,
    email,
    img_url,
    is_approval = true,
    new_approval = false,
  }) => {
    try {
      let response = await axios.put(`/cms/member/modify/${member_pk}`, {
        company_type,
        company_class,
        company_address,
        company_zipcode,
        company_ceo,
        company_phone: encrypt(company_phone),
        email: encrypt(email),
        img_url,
        is_approval,
        new_approval,
      });

      alert("회원정보 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Order
  getOrderList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    special_code,
    order_status,
  }) => {
    try {
      let data = await axios.get("/cms/order/list", {
        params: { page, paginate, search_word, term_start, term_end, sort_item, sort_type, special_code, order_status },
      });
      let ret = data.data.data.orderList;

      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getOrderDetail: async ({ order_pk }) => {
    try {
      let data = await axios.get(`/cms/order/view/${order_pk}`);
      let ret = data.data.data;

      ret.orderBase.email = decrypt(ret.orderBase.email);
      ret.orderBase.phone = decrypt(ret.orderBase.phone);
      ret.orderBase.delivery_phone = decrypt(ret.orderBase.delivery_phone);

      if (ret.settleInfo.card_number) {
        ret.settleInfo.card_number =
          ret.settleInfo.card_number.substring(0, 4) + " **** **** " + ret.settleInfo.card_number.substring(12, 16);
      }

      let order_status_no;
      let next_status_list = [];

      // ret.orderBase.order_status = "WAIT";
      // ret.orderBase.order_status = "INCOME";
      // ret.orderBase.order_status = "READY";
      // ret.orderBase.order_status = "TRANSING";
      // ret.orderBase.order_status = "TRANSOK";
      // ret.orderBase.order_status = "CANCEL_A";
      // ret.orderBase.order_status = "CANCEL_B";
      // ret.orderBase.order_status = "RETURN";

      switch (ret.orderBase.order_status) {
        case "WAIT":
          order_status_no = 1;
          break;
        case "INCOME":
          order_status_no = 2;
          break;
        case "READY":
          order_status_no = 3;
          break;
        case "TRANSING":
          order_status_no = 4;
          break;
        case "TRANSOK":
          order_status_no = 5;
          break;
        case "CANCEL_A":
          order_status_no = 6;
          break;
        case "CANCEL_B":
          order_status_no = 7;
          break;
        case "RETURN":
          order_status_no = 8;
          break;
      }

      const order_status_list = [
        {
          label: "입금대기",
          code: "WAIT",
        },
        {
          label: "입금완료",
          code: "INCOME",
        },
        {
          label: "배송준비중",
          code: "READY",
        },
        {
          label: "출고완료",
          code: "TRANSING",
        },
        {
          label: "배송완료",
          code: "TRANSOK",
        },
        {
          label: "주문취소",
          code: "CANCEL_A",
        },
        {
          label: "주문취소처리",
          code: "CANCEL_B",
        },
        {
          label: "교환요청",
          code: "RETURN",
        },
      ];

      next_status_list.push(order_status_list[order_status_no - 1]);
      if (order_status_no <= 6 && order_status_no !== 5) {
        next_status_list.push(order_status_list[order_status_no]);
      }
      if (order_status_no <= 3) {
        next_status_list.push(order_status_list[6]);
      }
      if (order_status_no == 8) {
        next_status_list.push(order_status_list[2]);
      }
      if (order_status_no == 5) {
        next_status_list.push(order_status_list[7]);
      }

      ret.orderBase.order_status_no = order_status_no;
      ret.orderBase.order_status_text = order_status_list[order_status_no - 1].label;
      ret.orderBase.next_status_list = next_status_list;

      // ret.product.product_info.child.forEach((item) => {

      //   if(item.event_price > 0){
      //     item.price_text = `${price(item.price)}원`;
      //   } else {
      //     item.price_text = `${price(item.price)}원`;
      //   }
      // });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  modifyOrderStatus: async ({ order_pk, member_pk, nowOrderStatus, newOrderStatus }) => {
    try {
      let response = await axios.put(`/cms/order/modify/${order_pk}`, {
        member_pk,
        nowOrderStatus,
        newOrderStatus,
      });

      alert("주문상태 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Category
  getCategoryList: async ({ search_word, is_cms = true }) => {
    try {
      let data = await axios.get("/cms/category/list", {
        params: { search_word, is_cms },
      });
      let ret = data.data.data;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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

      alert("카테고리 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getCategoryDetail: async ({ category_pk, category_type }) => {
    try {
      let data = await axios.get(`/cms/category/view/${category_pk}`, {
        params: { category_type },
      });

      console.log(data);

      let ret = data.data.data.categoryDetail;

      if (ret.category_type === "N") {
        for (let i = 1; i <= 3; i++) {
          ret[`d${i}`] = ret[`depth${i}code`];
        }
      }

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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
          if (ret.d2[item.group_code]) {
            ret.d2[item.group_code].push(item);
          } else {
            ret.d2[item.group_code] = [item];
          }
        } else {
          // d3
          if (ret.d3[item.group_code]) {
            ret.d3[item.group_code].push(item);
          } else {
            ret.d3[item.group_code] = [item];
          }
        }
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  registCategory: async ({
    category_name,
    category_logo,
    category_seq = 1,
    category_type,
    normalcategory_pk,
    reg_member,
  }) => {
    try {
      let response = await axios.post("/cms/category/regist", {
        category_name,
        category_logo,
        category_seq,
        category_type,
        normalcategory_pk,
        reg_member,
      });

      alert("카테고리 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return "";
    }
  },
  modifyCategory: async ({
    category_pk,
    category_name,
    category_logo,
    category_seq = 1,
    category_type,
    category_yn,
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

      alert("카테고리 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyCategorySequence: async ({ category_type, category_array }) => {
    try {
      let response = await axios.put(`/cms/category/seqmodify`, {
        category_type,
        category_array,
      });

      alert("카테고리 노출순서 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Product
  getProductList: async ({ category_pk, page, paginate = 10, search_word }) => {
    try {
      let data = await axios.get("/cms/product/list", {
        params: { category_pk, page, paginate, search_word },
      });

      let ret = data.data.data.productList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getProductDetail: async ({ product_pk }) => {
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  removeProduct: async ({ product_array }) => {
    try {
      let response = await axios.delete("/cms/product/remove", {
        data: { product_array },
      });

      alert("상품 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  registProduct: async ({
    product_name,
    category_pk,
    material,
    thumb_img,
    detail_img1,
    detail_img2,
    detail_img3,
    detail_img4,
    each_price,
    box_price,
    box_unit,
    carton_price,
    carton_unit,
    event_each_price,
    event_box_price,
    event_box_unit,
    event_carton_price,
    event_carton_unit,
    display_seq,
    can_point,
    is_nonpoint,
    event_each_stock,
    event_box_stock,
    event_carton_stock,
    reg_member,
    use_yn,
  }) => {
    try {
      let response = await axios.post("/cms/product/regist", {
        product_name,
        category_pk,
        material,
        thumb_img,
        detail_img1,
        detail_img2,
        detail_img3,
        detail_img4,
        each_price,
        box_price,
        box_unit,
        carton_price,
        carton_unit,
        event_each_price,
        event_box_price,
        event_box_unit,
        event_carton_price,
        event_carton_unit,
        display_seq,
        can_point,
        is_nonpoint,
        event_each_stock,
        event_box_stock,
        event_carton_stock,
        reg_member,
        use_yn,
      });

      alert("상품 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyProduct: async ({
    product_name,
    category_pk,
    material,
    thumb_img,
    detail_img1,
    detail_img2,
    detail_img3,
    detail_img4,
    detail_img5,
    each_price,
    box_price,
    box_unit,
    carton_price,
    carton_unit,
    event_each_price,
    event_box_price,
    event_box_unit,
    event_carton_price,
    event_carton_unit,
    display_seq,
    can_point,
    is_nonpoint,
    is_soldout,
    event_each_stock,
    event_box_stock,
    event_carton_stock,
    use_yn,
    product_pk,
    measure,
  }) => {
    try {
      let response = await axios.put(`/cms/product/modify/${product_pk}`, {
        product_name,
        category_pk,
        material,
        thumb_img,
        detail_img1,
        detail_img2,
        detail_img3,
        detail_img4,
        detail_img5,
        each_price,
        box_price,
        box_unit,
        carton_price,
        carton_unit,
        event_each_price,
        event_box_price,
        event_box_unit,
        event_carton_price,
        event_carton_unit,
        display_seq,
        can_point,
        is_nonpoint,
        is_soldout,
        event_each_stock,
        event_box_stock,
        event_carton_stock,
        use_yn,
        measure,
      });

      alert("상품 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyProductSequence: async ({ category_pk, product_array }) => {
    try {
      let response = await axios.put(`/cms/product/seqmodify`, {
        category_pk,
        product_array,
      });

      alert("상품 노출순서 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  sendRestockMessage: async ({ product_name, product_pk, thumb_img }) => {
    try {
      let response = await axios.post("cms/alarm/pushsend", {
        title: "[슈퍼바인더]상품 재입고알림",
        comment: `${product_name} 재입고 되었습니다.`,
        routeName: "ProductDetailStack",
        routeIdx: product_pk,
        img_url: getFullImgURL(thumb_img),
      });

      alert("재입고 메시지 발송을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Recommend
  getRecommendList: async () => {
    try {
      let data = await axios.get("/cms/product/mdlist");

      let ret = data.data.data.productList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  modifyRecommendSequence: async ({ product_array }) => {
    try {
      let response = await axios.put(`/cms/product/mdrecom`, {
        product_array,
      });

      alert("추천상품 노출순서 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Event
  getEventList: async ({ page = 1, paginate = 10, search_word, filter_item = "now" }) => {
    try {
      let data = await axios.get(`/cms/event/list/${filter_item}`, {
        params: { page, paginate, search_word },
      });

      let ret = data.data.data.eventList;
      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getEventProductData: async ({ page = 1, paginate = 10, category_pk }) => {
    try {
      let data = await axios.get("/cms/product/all", {
        params: {
          page,
          paginate,
          category_pk,
        },
      });
      let ret = {
        product_list: data.data.data.productList,
        category_list: [
          {
            label: "전체",
            category_pk: "",
          },
        ],
      };

      let category_set = new Set();

      ret.product_list.forEach((item) => {
        category_set.add(
          JSON.stringify({
            label: item.category_name,
            category_pk: item.category_pk,
          }),
        );
      });

      category_set.forEach((item) => {
        ret.category_list.push(JSON.parse(item));
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  registEvent: async ({ event_img, event_gubun, start_dt, end_dt, title, product }) => {
    try {
      let response = await axios.post(`/cms/event/regist`, {
        event_gubun,
        start_dt,
        end_dt,
        title,
        product,
        event_img
      });

      alert("이벤트 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyEvent: async ({ event_pk, event_img, event_gubun, start_dt, end_dt, title, product }) => {
    try {
      let response = await axios.put(`/cms/event/modify/${event_pk}`, {
        event_gubun,
        start_dt,
        end_dt,
        title,
        product,
        event_img
      });

      alert("이벤트 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  haltEvent: async ({ event_pk }) => {
    try {
      let response = await axios.patch(`/cms/event/stop/${event_pk}`);
      alert("이벤트를 중지했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeEvent: async ({ event_pk }) => {
    try {
      let response = await axios.delete(`/cms/event/remove/${event_pk}`);

      alert("이벤트 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Popup
  getCurNoticePopupList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/popup/list/now", {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.nowPopList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getPrevNoticePopupList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/popup/list/stop", {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.stopPopList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getCurEventPopupList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/popevent/list/now", {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.nowPopupEventList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getPrevEventPopupList: async ({ page, paginate = 10 }) => {
    try {
      let data = await axios.get("/cms/popevent/list/stop", {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.stopPopupEventList;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getNoticePopupDetail: async ({ popup_pk }) => {
    try {
      let data = await axios.get(`/cms/popup/view/${popup_pk}`);
      let ret = data.data.data.popupDetail;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getEventPopupDetail: async ({ popup_pk, inlink_type }) => {
    try {
      let data = await axios.get(`/cms/popevent/view/${popup_pk}`, {
        params: {
          inlink_type,
        },
      });
      let ret = data.data.data.popEventDetail;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  registNoticePopup: async ({ popup_gubun, popup_type, title, start_dt, end_dt, img_url, send_push }) => {
    try {
      let response = await axios.post("/cms/popup/regist", {
        popup_gubun,
        popup_type,
        title,
        start_dt,
        end_dt,
        img_url,
        send_push,
      });

      alert("공지팝업 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  registEventPopup: async ({ popup_gubun, start_dt, end_dt, img_url, title, popup_type, target_pk, inlink_type }) => {
    try {
      let response = await axios.post("/cms/popevent/regist", {
        popup_gubun,
        start_dt,
        end_dt,
        img_url,
        title,
        popup_type,
        target_pk,
        inlink_type,
      });

      alert("이벤트팝업 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyNoticePopup: async ({ popup_pk, popup_gubun, popup_type, title, start_dt, end_dt, img_url, send_push }) => {
    try {
      let response = await axios.put(`/cms/popup/modify/${popup_pk}`, {
        popup_gubun,
        popup_type,
        title,
        start_dt,
        end_dt,
        img_url,
        send_push,
      });

      alert("공지팝업 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyEventPopup: async ({
    popup_pk,
    popup_gubun,
    start_dt,
    end_dt,
    img_url,
    title,
    popup_type,
    target_pk,
    inlink_type,
  }) => {
    try {
      let response = await axios.put(`/cms/popevent/modify/${popup_pk}`, {
        popup_gubun,
        start_dt,
        end_dt,
        img_url,
        title,
        popup_type,
        target_pk,
        inlink_type,
      });

      alert("이벤트팝업 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  haltNoticePopup: async ({ popup_pk, restart_dt }) => {
    try {
      let response = await axios.patch(`/cms/popup/stop/${popup_pk}`, {
        restart_dt,
      });

      alert("공지팝업을 중지했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  haltEventPopup: async ({ popup_pk, restart_dt }) => {
    try {
      let response = await axios.patch(`/cms/popevent/stop/${popup_pk}`, {
        restart_dt,
      });

      alert("이벤트팝업을 중지했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeNoticePopup: async ({ popup_pk }) => {
    try {
      let response = await axios.delete(`/cms/popup/remove/${popup_pk}`);

      alert("공지팝업 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeEventPopup: async ({ popup_pk }) => {
    try {
      let response = await axios.delete(`/cms/popevent/remove/${popup_pk}`);

      alert("이벤트팝업 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeNoticePopupMultiple: async ({ popup_array }) => {
    try {
      let response = await axios.put(`/cms/popup/removes`, {
        popup_array,
      });

      alert("공지팝업 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeEventPopupMultiple: async ({ popup_array }) => {
    try {
      let response = await axios.put(`/cms/popevent/removes`, {
        popup_array,
      });

      alert("이벤트팝업 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Notice
  getNoticeList: async ({ page = 1, paginate = 10, search_word }) => {
    try {
      let data = await axios.get("/cms/notice/list", {
        params: {
          page,
          search_word,
          paginate,
        },
      });
      let ret = data.data.data.noticeList;

      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getNoticeDetail: async ({ notice_pk }) => {
    try {
      let data = await axios.get(`/cms/notice/view/${notice_pk}`);
      let ret = data.data.data;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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

      alert("공지 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyNotice: async ({ notice_pk, title, content, start_dt, img_url, send_push }) => {
    try {
      let response = await axios.put(`/cms/notice/modify/${notice_pk}`, {
        title,
        content,
        start_dt,
        img_url,
        send_push,
      });

      alert("공지 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeNotice: async ({ notice_pk }) => {
    try {
      let response = await axios.delete(`/cms/notice/remove/${notice_pk}`);

      alert("공지 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Coupon
  getValidCouponList: async ({ page = 1, paginate = 10 }) => {
    try {
      let data = await axios.get(`/cms/coupon/list/ing`, {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.validCouponList;

      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
        item.coupon_type = item.price;
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getPassCouponList: async ({ page = 1, paginate = 10 }) => {
    try {
      let data = await axios.get(`/cms/coupon/list/old`, {
        params: {
          page,
          paginate,
        },
      });
      let ret = data.data.data.passCouponList;

      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
        item.coupon_type = item.price;
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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

      alert("쿠폰 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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

      alert("쿠폰 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeCoupon: async ({ coupon_pk }) => {
    try {
      let response = await axios.delete(`/cms/coupon/remove/${coupon_pk}`);

      alert("쿠폰 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
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

      ret.forEach((item, index) => {
        item.no = getListIndex(item.total, page, index);
        if (item.link_type === "INLINK") {
          switch (item.inlink_type) {
            case "PRODUCT":
              item.link_type_text = "상품";
              break;
            case "CATEGORY":
              item.link_type_text = "카테고리";
              break;
            case "EVENT":
              item.link_type_text = "이벤트";
              break;
          }
        } else {
          item.link_type_text = "외부링크";
        }
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getBannerDetail: async ({ banner_pk, link_type, inlink_type }) => {
    try {
      let data = await axios.get(`/cms/banner/view/${banner_pk}`, {
        params: {
          link_type,
          inlink_type,
        },
      });
      let ret = data.data.data.bannerDetail;

      if (ret.link_type === "INLINK") {
        switch (ret.inlink_type) {
          case "PRODUCT":
            ret.target = {
              target_pk: ret.target_pk,
              name: ret.productdetail.product_name,
              thumb_img: ret.productdetail.thumb_img,
            };
            break;
          case "CATEGORY":
            ret.target = {
              target_pk: ret.target_pk,
              name: ret.categorydetail.category_name,
            };
            break;
          case "EVENT":
            ret.target = {
              target_pk: ret.target_pk,
              name: ret.eventdetail.title,
            };
            break;
        }
      }

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  registBanner: async ({ link_type, inlink_type, target_pk, target_url, img_url, title, content }) => {
    try {
      let response = await axios.post("/cms/banner/regist", {
        link_type,
        inlink_type,
        target_pk,
        target_url,
        img_url,
        title,
        content,
      });

      alert("배너 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyBanner: async ({ banner_pk, link_type, inlink_type, target_pk, target_url, img_url, title, content }) => {
    try {
      let response = await axios.put(`/cms/banner/modify/${banner_pk}`, {
        link_type,
        inlink_type,
        target_pk,
        target_url,
        img_url,
        title,
        content,
      });

      alert("배너 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifyBannerSequence: async ({ banner_array }) => {
    try {
      let response = await axios.put(`/cms/banner/seqmodify`, {
        banner_array,
      });

      alert("배너 노출순서 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeBanner: async ({ banner_pk }) => {
    try {
      let response = await axios.delete(`/cms/banner/remove/${banner_pk}`);

      alert("배너 삭제를 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  // Salesman
  getSalesmanList: async ({ page = 1, paginate = 10, search_word, term_start, term_end, sort_item, sort_type }) => {
    try {
      let data = await axios.get("/cms/salesman/list", {
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
      let ret = data.data.data.salesmanList;

      ret.forEach((item) => {
        item.email = decrypt(item.email);
        item.phone = decrypt(item.phone);
      });

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getSalesmanDetail: async ({ member_pk }) => {
    try {
      let data = await axios.get(`/cms/salesman/view/${member_pk}`);
      let ret = data.data.data.userDetail;

      ret.email = decrypt(ret.email);
      ret.phone = decrypt(ret.phone);

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getSalsemanClientList: async ({ special_code, page = 1, paginate = 10, search_word, sort_item, sort_type }) => {
    try {
      let data = await axios.get("/cms/member/list", {
        params: {
          page,
          paginate,
          search_word,
          special_code,
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
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getSalesmanMonthlyIncentiveList: async ({ member_pk, sales_month }) => {
    try {
      let data = await axios.get(`/cms/salesman/incentive/month/${member_pk}`, {
        params: { sales_month },
      });
      let ret = data.data.data.monthData;

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  modifySalesman: async ({ member_pk, name, email, password, phone, is_retired, incentive_2, incentive_3 }) => {
    try {
      let response = await axios.put(`/cms/salesman/modify/${member_pk}`, {
        name,
        email: encrypt(email),
        phone: encrypt(phone),
        is_retired,
        password: !!password ? password : undefined,
        incentive_2,
        incentive_3,
      });

      alert("영업사원 정보 수정을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  registSalesman: async ({ name, user_id, password, email, phone }) => {
    try {
      let response = await axios.post("/cms/salesman/regist", {
        name,
        user_id,
        password,
        email: encrypt(email),
        phone: encrypt(phone),
      });

      alert("영업사원 등록을 완료했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  modifySalesmanPassword: async ({ member_pk, nowPassword, newPassword }) => {
    try {
      let response = await axios.patch(`/cms/salesman/modify/pass/${member_pk}`, {
        nowPassword,
        newPassword,
      });

      alert("비밀번호를 수정했습니다");
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
};
