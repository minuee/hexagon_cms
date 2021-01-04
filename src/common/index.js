export function price(num) {
  if (!Number.isInteger(num)) {
    return null;
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
