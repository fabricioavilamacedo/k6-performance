import pesquisarUnidade     from "../requests/EOL/pesquisarUnidade.js"
import pesquisarTurmaserie  from "../requests/EOL/pesquisarTurmaserie.js";
import { group, sleep }     from 'k6'
import { htmlReport }       from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  insecureSkipTLSVerify: true,
  vus:10,
  duration: '10s',
  threshoulds:{
    http_req_duration: ['p(95)<2000'], //95% of requests must respond within 4 seconds
    http_req_failed: ['rate<0.01'], //Only 1% of error requests should be accepted
  }
}

export default () => {

  group('Smoke Teste - Pesquisar Unidades', () => {
    pesquisarUnidade();
    pesquisarTurmaserie();
  });  

  group('Smoke Teste - Pesquisar Turmas e serie', () => {
    pesquisarTurmaserie();
  });  
}