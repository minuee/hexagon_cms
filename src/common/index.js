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
