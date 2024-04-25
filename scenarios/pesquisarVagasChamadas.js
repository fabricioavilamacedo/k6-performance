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
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6WyJTRTE0MjZTIiwidXN1YXJpbyBkZSBpbnRlZ3JlY2FvIGVvbCBhY2Vzc28gc2Vydmlkb3Ioc2VpNDI2KSJdLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvTG9naW4iOiJzZTE0MjZzIiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL1Npc3RlbWEiOiJzZWk0MjYiLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvSGllcmFycXVpYSI6IntcImNkc2VuaGFwYWRyYW9cIjpudWxsLFwiY2R1c3VhcmlvXCI6bnVsbCxcImNpaGllcmFycXVpYXVzdWFyaW9cIjo4MjE3MyxcImNpaGllcmFycXVpYXVzdWFyaW9hbHRlcmFjYW9cIjowLFwiY2loaWVyYXJxdWlhdXN1YXJpb2luY2x1c2FvXCI6MCxcImNpdXN1YXJpb1wiOjY3MDg3LFwiY29kaWdvaGllcmFycXVpYVwiOjI5MzMsXCJjb2RpZ29oaWVyYXJxdWlhcGFpXCI6bnVsbCxcImR0YWx0ZXJhY2FvXCI6bnVsbCxcImR0aW5jbHVzYW9cIjpudWxsLFwiaW5hZG1pbmlzdHJhZG9yaGllcmFycXVpYVwiOmZhbHNlLFwibm9tZWhpZXJhcnF1aWFcIjpcIndlYnNlcnZpY2UgY29udHJvbGUgZGUgaW50ZWdyYWNhb1wiLFwibnJvcmRlbVwiOjAsXCJzaWdsYWhpZXJhcnF1aWFcIjpcIndzaVwifSIsImFkZnMxZW1haWwiOiIiLCJodHRwOi8vc2NoZW1hcy5wcm9kYW0uc3AuZ292LmJyL3N0cy9jbGFpbXMvTW9kZWxvQXV0b3JpemFjYW8iOiIxIiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL1JlY3Vyc29zIjoiQWdBQUFCK0xDQUFBQUFBQUJBQ0xqZ1VBS2J0TURRSUFBQUE9Iiwicm9sZSI6IkNCa0FBQitMQ0FBQUFBQUFCQUNkV2R1TzNDZ1EvUlhVVHhzcEV3RytZT2NqOHBEWGFCV1ZnZTVoWkJzUDROa28wZjc3Z3UyZXl5b2RxSG16dXFmUE1YVTVwNHI1OXVza3pmZDdveDI0eDlYQTk0dGJGM3Y2VEU2ZFlPTDA4VFJQTHgrQjFONWJBc1JwSHdnc2hwREp6aVpZWitZTGtUQVFja2Y4dVJPOGo3LzBKcXdnWWZ2bGw2K25mei8raWFyTFVrazcrM1VNRUI5R0dLd0RaZU4zT0o2TzB5eVBOL0NnMGpsbVZ0RVdlWTYydW9GdlkzaVdJTytCTE00cW1DTEJzdlMwNnBBSFlNMU5BcVdKSGU4dG1ZSFl3UUVoWGxGZU14UUJaL1d0cE5zWUdSLzBGSUZWa0hiUGRDTndtZVp0Znl2VEwvaGd6QldkbzlCWkwyNkg1eGw5QVJNU2ZtQnRYZUhDWDFjRmJ4OFQvQVJFbVlzSk1DYWlrWEtLekhQVjE2VkVMaGF0U3VsWVI4cXdQSUx6UE04VGpDYmhwUXBUMnV0cDBYT3NzN3QvOUJDNXNmV1ZKeHpVZWN0L1h3dUJ6SCtYUjA4eTlTNlZFcUxMWjErQ0pNdTQra2lSeEdUcjh0aTF5RExidWpaSHBENlI0TXp3aWVnZjRZZ1hvemdpWGxEUGtRam1oSzk0UmJFSDZXN3A3VnQ4SDV3bGZ3M2c5WWRVWkV2NkcvQjdtcEFWVUJXRnpzelhpTlc0RTdXc3BNSmMwTWE5MWdEbGFjdHc1Y1phVVhBVU9SMVMyZUtzaXZXOEFGMU5SNWc0VWlpYjZyWVIvZzQ5aFVoN2MwYVdGeTA0ZzFhYm0wUXZ4Q2FncDNrM2lSL0VrU1RWTEZ4ZzBuT3cvbm9vWEMreWxoVWN4dG40cTRPQTRzeVJVNXB2ZGpVdVJ6MTFPUFRvV1BuR09JT01ubkc4Zm92VjlpYWZqZk02eGVhK21nZGFkZk5pZFZGeTF1R2RMVmVpSFdZSjZ3YmZNSWJzT1Y3dy9pWU14MnlGblgwNDdmUHhIOTJ6YzJQUlJUNDI4N0JKNlVvWjB1ZWlsT2JsYUQ3cmErbmpQRWZFU3NpaTJ4RGtQblFLaXJNYzBiWDVrZndOZkhxd1NZdjA4OUtFWk96eWpFdWNvOU9RTTFDQjNKSkVpYTR1K25HdnBLYkN0YkZvZVY3bTRsQlc5VTBra0RObzVBSlRGOEE3TFNGdHhic1p6TFJueUVXeXF2TUY2L1RqcXAzWlRHZWZ6N0I5MGRVRnNmSUs5a04wU01QcFJNR3U1M1hjQ05wSVlHWXZuVWxiUnF6WjRDQnNKS2d1RndXN2hkZm41K1crd2U1S2VYMzEybHlQYzNIYmwxNjdwN2lmdWY5eDVlYm12S0w0dUlRQmVmRlR6dmFkQTlrdGRaOW5TbTZON2NLQ05rbTRQWGIrN2dzaWM3bTZVSXR6SVNIYUV2U3d2RS9KV1gvelJ1MFZ2TkhuNjM2S0ZBMWVsY0JmSURuRkU5QUdlVm5RZGdYN2I4VDMrL0tyWjVCV2J3TDR3Q2pETlJzdmFqWXpMYzV1dnZkQSt3cFpTWlFXNU5yNGRJaGpmMERlcFVYakxqbUR0L3RJTnJNYXFVaXM0eVVKOXo5dDJuYmxRaXVLbTduYnJrUlJIeml2a1Z0Nlc1SmRlL1JCelpHWnJic0NUZHR1Lys3Mk81b1lJQ0R3Y3gydkd6dDIvaXZnVzBFZmw0NE5jbHdTQmROWU1HcTdhK280MHFSRis0Y2I1YmZvL3A1aWI3SkVjMXV1L1c2Tk1qNm9Wd3ZvS3JFMzRyOE4vdkxtdnhUWk8vMi8vd01HQzF3bUNCa0FBQT09IiwibmJmIjoxNzA1MzI4MDYxLCJleHAiOjE3MDUzMjgxMjEsImlhdCI6MTcwNTMyODA2MSwiaXNzIjoiaHR0cDovL3dlYmRlc2VudjUucHJvZGFtIiwiYXVkIjoiaHR0cDovLzU5ODkzYTZkLWY2ZGUtNGY5OS1hZDY3LWFiYTIxYTVlYWIyMyJ9.Fvuqo8i67wcTbbjcOGVZYfrdTjVaIrEXZ6oxqdbNlJA',
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
  console.log('>>>>>>>>>>>>', res)
  if (!check(res, {
    'Validar se o stauts code retorna 200 - Api pesquisar vagas chamadas': (r) => r.status === 200,
    'Validar a duracao maxima': (r) => r.timings.duration < 4000
  })) {
    fail(durationMsg);

  }
  sleep(1);
}

