export const BASE_URL = "https://serverest.dev"

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
}

export const THRESHOLDS = {
  http_req_duration: ["p(95)<2000"],
  http_req_failed: ["rate<0.01"]
}