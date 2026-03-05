import { get, post } from "../helpers/requestHelper.js";

const BASE_URL = "https://serverest.dev";

export function getProducts(token) {

  const headers = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  };

  return get(`${BASE_URL}/produtos`, headers);
}

export function createProduct(token, product) {

  const headers = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  };

  return post(`${BASE_URL}/produtos`, product, headers);
}