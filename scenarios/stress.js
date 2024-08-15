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
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 300 },
    { duration: '10s', target: 0 }
    //{ duration: '5m', target: 300 },
    //{ duration: '2m', target: 400 },
    //{ duration: '5m', target: 400 },
    //{ duration: '10m', target: 0 }
  ],
  threshoulds:{
    http_req_duration: ['p(95)<2000'], //95% of requests must respond within 4 seconds
    http_req_failed: ['rate<0.01'], //Only 1% of error requests should be accepted
  }
}

export default () => {

  group('Smoke Teste - Pesquisar Unidades', () => {
    pesquisarUnidade();
  });  

  group('Smoke Teste - Pesquisar Turmas e serie', () => {
    pesquisarTurmaserie();
  });  
}