import http from "k6/http";

const BASE_URL = "https://serverest.dev";

export function login() {

  const payload = {
    email: "k6@test.com",
    password: "teste"
  };

  const params = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const res = http.post(`${BASE_URL}/login`, JSON.stringify(payload), params);

  const body = JSON.parse(res.body);

  return body.authorization;
}