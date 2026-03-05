import { group, sleep } from "k6"
import { login } from "../services/authService.js"
import { getProducts, createProduct } from "../services/productService.js"
import { generateProduct } from "../data/products.js"
import { THRESHOLDS } from "../config/config.js"
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "3m", target: 50 },
    { duration: "1m", target: 0 }
  ],
  thresholds: THRESHOLDS
};

export function setup() {
  const token = login()
  return { token }
}

export default function (data) {

  const token = data.token

  group("Products Flow", () => {

    getProducts(token)

    const product = generateProduct()

    createProduct(token, product)

  });

  sleep(1)
}
//report
export function handleSummary(data) {

  const now = new Date();

  const timestamp =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    "-" +
    String(now.getMinutes()).padStart(2, "0") +
    "-" +
    String(now.getSeconds()).padStart(2, "0");

  const fileName = `reports/load-${timestamp}.html`;

  return {
    [fileName]: htmlReport(data),
  };
}