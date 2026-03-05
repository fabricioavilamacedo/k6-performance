import { Trend, Rate } from "k6/metrics"

export const apiDuration = new Trend("api_duration")
export const apiSuccessRate = new Rate("api_success_rate")
export const apiFailRate = new Rate("api_fail_rate")