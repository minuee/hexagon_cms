import CryptoJS from "crypto-js";

const appID = "hexagonadmin";
const CommonSaltKey = "hexagonadmineda40baa4fHynnm4W1";

const key_hash = CryptoJS.MD5(appID);
const hashkey = CryptoJS.enc.Utf8.parse(key_hash);
const hashiv = CryptoJS.enc.Utf8.parse(CommonSaltKey);

export function encrypt(str) {
  let encrypted = CryptoJS.AES.encrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
  return encrypted.toString();
}
export function decrypt(str) {
  try {
    let decrypted = CryptoJS.AES.decrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log({ e });
    return str;
  }
}

export function price(num) {
  if (!Number.isInteger(num)) {
    return null;
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRandomColor() {
  let r = Math.floor(Math.random() * 255).toString(16);
  if (r.length === 1) {
    r = "0" + r;
  }
  let g = Math.floor(Math.random() * 255).toString(16);
  if (g.length === 1) {
    g = "0" + g;
  }
  let b = Math.floor(Math.random() * 255).toString(16);
  if (b.length === 1) {
    b = "0" + b;
  }
  let rgb = `${r}${g}${b}`;

  return rgb;
}
