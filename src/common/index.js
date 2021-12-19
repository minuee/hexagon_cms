import CryptoJS from "crypto-js";
import { IMAGE_BASE_URL } from "env";

const appID = "hexagonadmin";
const CommonSaltKey = "hexagonadmineda40baa4fHynnm4W1";

const key_hash = CryptoJS.MD5(appID);
const hashkey = CryptoJS.enc.Utf8.parse(key_hash);
const hashiv = CryptoJS.enc.Utf8.parse(CommonSaltKey);

export function encrypt(str) {
  if (!str) return str;

  let encrypted = CryptoJS.AES.encrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
  return encrypted.toString();
}
export function decrypt(str) {
  if (!str) return str;

  try {
    let decrypted = CryptoJS.AES.decrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log({ e });
    return str;
  }
}

export function price(num) {
  let tmp = parseInt(num);

  if (Number.isNaN(tmp)) {
    return null;
  } else {
    return tmp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export function getFullImgURL(relative_path) {
  if (!relative_path) {
    return null;
  } else {
    return IMAGE_BASE_URL + relative_path;
  }
}

export function getListIndex(total, page, idx) {
  let tmp = +total - (+page - 1) * 10 - +idx;
  return tmp;
}
