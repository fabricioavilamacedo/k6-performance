import PostPesqCand from "./scenarios/pesquisarCandidato.js";
import PutAtualizar from "./scenarios/atualizarCandidato.js";
import PostPesquisar from "./scenarios/pesquisarVagasChamadas.js";
import { group, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '60s', target: 1000},
    //{ duration: '20s',  target: 50 },
   // { duration: '10s',  target: 10 },
    //{ duration: '15s',  target: 100 },
    //{ duration: '5s',   target: 50 },
    //{ duration: '1s',   target: 1 }
  ]
}

export default () => {

  group('Endpoint Pesquisar Candidato - Ingresso Servidor', () => {
    PostPesqCand();
  });

  //group('Endpoint Atualizar Candidato - Ingresso Servidor', () => {
  // PutAtualizar();
  //});

  // group('Endpoint Pesquisar vagas chamadas - Ingresso Servidor', () => {
  //   PostPesquisar();
  //  });
}

