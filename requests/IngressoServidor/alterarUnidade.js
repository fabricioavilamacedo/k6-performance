import http from 'k6/http';
import { sleep } from 'k6';
import { check, fail } from "k6";
import { Trend, Rate, Counter } from 'k6/metrics'

export let PostCpfDuration = new Trend('post_cpf_duration')
export let PostCpfRate = new Rate('post_cpf_rate')
export let PostCpfFailRate = new Rate('post_cpf_fail_rate')
export let PostCpfSuccessRate = new Rate('post_cpf_success_rate')
export let PostCpfReqs = new Rate('post_cpf_reqs')

export default function () {
  let payload = {
    "cdChamadaConcurso": "string",
    "cdCargo": "string",
    "nomeUnidade": "string",
    "cdTipoUnidade": "string",
    "tipoUnidade": "string",
    "cdTipoLocalizacao": "string",
    "cdDistrito": "string",
    "cdUnidadeDRE": "string",
    "valorDistanciaMaxima": "string",
    "latitudeLocalizacao": "string",
    "longitudeLocalizacao": "string",
    "cdTipoOrdenacao": "string",
    "distanciaPeloEnderecoResidencial": true,
    "distanciaPelaLocalizacao": true,
    "tipoLocalizacaoDistrito": "string",
    "tipoLocalizacaoDRE": "string"
  };

  let headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6WyJTRTE0MjZTIiwidXN1YXJpbyBkZSBpbnRlZ3JlY2FvIGVvbCBhY2Vzc28gc2Vydmlkb3Ioc2VpNDI2KSJdLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvTG9naW4iOiJzZTE0MjZzIiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL1Npc3RlbWEiOiJzZWk0MjYiLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvSGllcmFycXVpYSI6IntcImNkc2VuaGFwYWRyYW9cIjpudWxsLFwiY2R1c3VhcmlvXCI6bnVsbCxcImNpaGllcmFycXVpYXVzdWFyaW9cIjo4MjE3MyxcImNpaGllcmFycXVpYXVzdWFyaW9hbHRlcmFjYW9cIjowLFwiY2loaWVyYXJxdWlhdXN1YXJpb2luY2x1c2FvXCI6MCxcImNpdXN1YXJpb1wiOjY3MDg3LFwiY29kaWdvaGllcmFycXVpYVwiOjI5MzMsXCJjb2RpZ29oaWVyYXJxdWlhcGFpXCI6bnVsbCxcImR0YWx0ZXJhY2FvXCI6bnVsbCxcImR0aW5jbHVzYW9cIjpudWxsLFwiaW5hZG1pbmlzdHJhZG9yaGllcmFycXVpYVwiOmZhbHNlLFwibm9tZWhpZXJhcnF1aWFcIjpcIndlYnNlcnZpY2UgY29udHJvbGUgZGUgaW50ZWdyYWNhb1wiLFwibnJvcmRlbVwiOjAsXCJzaWdsYWhpZXJhcnF1aWFcIjpcIndzaVwifSIsImFkZnMxZW1haWwiOiIiLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvTW9kZWxvQXV0b3JpemFjYW8iOiIxIiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL1JlY3Vyc29zIjoiQWdBQUFCK0xDQUFBQUFBQUJBQ0xqZ1VBS2J0TURRSUFBQUE9Iiwicm9sZSI6IlJ4Z0FBQitMQ0FBQUFBQUFCQUNkV011TzVDWVUvUlZVcTBTYUhnRzJBYzlIWkpGdEZJMHdVTlcwYk9NRzNJa215cjhIL09qdWlhWUdidStzZXB4ajd1T2NlL25qbjR1eVh4K3Q4ZEkvcjFaK3ZmbDFjWmN2NkNJNDRaZFBsM2w2KzBncUU0SkRFbmtUSXBLTFJXaHlzNDNPMi9tR2xCd1Fla0RoS2pqdDB6K0RqYXRVY3Z2bmI3OWYvdjMwTXlwUnBGSnVEdXNZWlhvWTVlQzgxQzU5QitSaHpSMGVsMTUvaWVwUm9zVTdMYWQwa0dYcGNTTmdCSUowZHdtMFFXNThkR2lXeUExZUloUTBwaTBCRVZEUzNrdUtROEdHYUtZRXJLTnlleVk2RHNzRVpmMjlUTHpoUzJ0UGRBcENKejIvSDU1WDlFWGFtUEVqWVcwREMzL2JWTHg5U3ZDTFJOcmViSlJqSmhveHhjQThOMzFiUytSVDhlcWNqblhFQk1yREtTM3p2TWpSWnJ4Y1lkb0VNeTFtVG5YMjhKY1pFamUwdnNxRWc3NXUrZTliem9INUYyWDBMQ01mVWhIT1JUbjdTaXEwakd0SUZGbFV0aTVQWFFzc3M2MXJTMFQ2TTRyZURwK1IrVHNlOFNJWVJrUXI2amtSeVRuamE5cGc2RUVFcnNJUDBUdjB5eUNEK1RVWDJaSi9JOE9lSm1BRk5GV2hzL01ac1JaMklrWnFLc3hIWS8xN0RkQUJNd0lyTjhKNHhWSFVkRWdsWThCQTBRcDBQUjFob2tDaDdKcjdSdmdqOUJ3aUUrd1ZXRjY0NGd4R2IyNlN2QkNhZ0I2WDNTUjlrRWFHWExQeUppY3pSeGZPUThGNmtUQlNjUmp2MHI4T0Fnd3pSNHB4dWRuMXVCejFKR0RveWJIS2pYR1ZLbm5HOGZvTXF1MWRPUnZYZFVyTmZab0hXSFhMWW5YVGFqYnhneTFYb3gxMmllc0czeEVDN0RsYThmNDJEc2RzQloxOUtPN0w4Ui85cTNORDBYazVOdk93U2VtS0NkRG5rcFNXNVdpK21yUDBZWjdEVXlVVTBWMk1haDg2T1laWkRoZXNQSkovQjU4ZlhOWWk4N3JVQUJsRm1YRkpjM1FlY2diTU1hd1BlSTJ1THVaNXI2U3VnYlV4WjdRc2Mya29hL291RWFoWkd1QUMwMWJBZTZOazNscDNNNWh4VDJBaEVrMWJMbGh2bmxmajdXWTYrM3dHN1F2UlZzUXFhTGtmUWdBTlIvQ0tYUytZdEJHd1JHRG5vTHpOVzBhcTJlaGwzRWhBWGM0cmRvdGdycHMvektUWnFoQzBLNVgxTlJoN0h1Zm10eStEOFM5cFAvUC80eXJOeldWRkNXa0prK2pOVHluWmR3NWd0N1I5bVNtN05iUUxLOW9rNC9iUStidXZpTXp0ZENFR2N5SE9XUTE2WEQ2bTVLUy9lK1AxRHQ2YTY3bWZBa1dETmpYd041bWQ0a1hpRG5oWndFVEYvcHZ3dzc3OG1sa3FaellCZkNLWXdKcU5WaldiblJidk50OTd3bjBEckNTTUszSnRRejdFc1Q4QTc5S1NjZGVjSWJoOUpKdEpDMVFrSW1oTndzTTNsN2RkdGVBR3cyWnVKbW9VOVluU0ZyaWxzNXJzdXFNUFdnck1iQ3NxTkcyNy9Ydlk3MmhTZ0NTUzM5YngzTmloODE4RjN5ck5jZW5ZQWNjbFhqR05SYXUzdXlaQmdTYk4yVTl1bEw5SEQ0OFllcFBGdS90eUhYWnJWT2xCdjF0QVYvVURoai8vQTh0dXJZaEhHQUFBIiwibmJmIjoxNzA0OTE1NDE4LCJleHAiOjE3MDQ5MTU0NzgsImlhdCI6MTcwNDkxNTQxOCwiaXNzIjoiaHR0cDovL3dlYmRlc2VudjUucHJvZGFtIiwiYXVkIjoiaHR0cDovLzU5ODkzYTZkLWY2ZGUtNGY5OS1hZDY3LWFiYTIxYTVlYWIyMyJ9.u5S13WRNiw72qCN_ZucJmQLaVmsd7apUQQR3Z_gx-o8',
  };

  let res = http.put(
    'https://se1426.dapp.prodam/ingressoapi/api/v1/Concurso/PesquisarVagasChamada',
    JSON.stringify(payload),
    { headers: headers }
  );

  PostCpfDuration.add(res.timings.duration);
  PostCpfRate.add(1);
  PostCpfFailRate.add(res.status == 0 || res.status > 399);
  PostCpfSuccessRate.add(res.status < 399);

  let durationMsg = 'Falha na execução do cenário de teste da Api de pesquisar vagas chamadas'

  if (!check(res, {
    'Validar se o stauts code retorna 200 - Api pesquisar vagas chamadas': (r) => r.status === 200
  })) {
    fail(durationMsg);

  }
  sleep(1);
}

