import http                     from 'k6/http';
import { sleep }                from 'k6';
import { check, fail }          from "k6";
import { Trend, Rate, Counter } from 'k6/metrics'
import { encodeFormData }       from 'k6/encoding';
import cpfs                     from '../resources/cpfList.js';

export let PostCpfDuration = new Trend('post_cpf_duration')
export let PostCpfRate = new Rate('post_cpf_rate')
export let PostCpfFailRate = new Rate('post_cpf_fail_rate')
export let PostCpfSuccessRate = new Rate('post_cpf_success_rate')
export let PostCpfReqs = new Rate('post_cpf_reqs')

export default function () {
  const randomIndex = Math.floor(Math.random() * cpfs.length)
  const cpf = cpfs[randomIndex]
  const url = 'http://eoldev.prodam/_SE1426_WS_EOL_ONLINE/api/v1/candidatoaluno/incluirCandidato'
  const headers = {
    'Content-Type': 'application/vnd.com.equifax.clientconfig.v1+json',
    'Accept': 'text/plain',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6WyJTRTE0MjZJMDEiLCJzZTE0MjYgLSBlb2wgLSBlc2NvbGEgb25saW5lIl0sImh0dHA6Ly9zY2hlbWFzLnByb2RhbS5zcC5nb3YuYnIvc3RzL2NsYWltcy9Mb2dpbiI6InNlMTQyNmkwMSIsImh0dHA6Ly9zY2hlbWFzLnByb2RhbS5zcC5nb3YuYnIvc3RzL2NsYWltcy9TaXN0ZW1hIjoic2UxNDI2IiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL0hpZXJhcnF1aWEiOiJ7XCJjZHNlbmhhcGFkcmFvXCI6bnVsbCxcImNkdXN1YXJpb1wiOm51bGwsXCJjaWhpZXJhcnF1aWF1c3VhcmlvXCI6NzkyMTcsXCJjaWhpZXJhcnF1aWF1c3VhcmlvYWx0ZXJhY2FvXCI6MCxcImNpaGllcmFycXVpYXVzdWFyaW9pbmNsdXNhb1wiOjAsXCJjaXVzdWFyaW9cIjo2NTYzMyxcImNvZGlnb2hpZXJhcnF1aWFcIjoyOTMzLFwiY29kaWdvaGllcmFycXVpYXBhaVwiOm51bGwsXCJkdGFsdGVyYWNhb1wiOm51bGwsXCJkdGluY2x1c2FvXCI6bnVsbCxcImluYWRtaW5pc3RyYWRvcmhpZXJhcnF1aWFcIjpmYWxzZSxcIm5vbWVoaWVyYXJxdWlhXCI6XCJ3ZWJzZXJ2aWNlIGNvbnRyb2xlIGRlIGludGVncmFjYW9cIixcIm5yb3JkZW1cIjowLFwic2lnbGFoaWVyYXJxdWlhXCI6XCJ3c2lcIn0iLCJhZGZzMWVtYWlsIjoiZmVsaXBlbHNhbnRvc0Bwcm9kYW0uc3AuZ292LmJyIiwiaHR0cDovL3NjaGVtYXMucHJvZGFtLnNwLmdvdi5ici9zdHMvY2xhaW1zL01vZGVsb0F1dG9yaXphY2FvIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnByb2RhbS5zcC5nb3YuYnIvc3RzL2NsYWltcy9SZWN1cnNvcyI6IlNnd0FBQitMQ0FBQUFBQUFCQUROVnNtTzJ6QU0vUlhCNXpTSU04dWhuOUgyVmhRR1IySWNGcEtvYWpHQ0Z2MzNVaDRncVNjdGpDeVk1R1NaQy9RZUgwWHA2NjlHczZHZVAxUEs2S0Q1cUpxRTdlUDZ1Vm1vSnFJdU1mSEIyQ0hiRG93anYzVGdNOFpjb29NT2syWUxTMGhoVjlPTS9FZlNNQ2EreHFreFVMMEcxcGlCRWcxb2EwU09CWnRGczRVWHNwVEJqR2tic0tsYXRmbENnVDhkZ0t5YjM0c3pRR3N3a0hMazFMMUFJczNwQ09nK1F2MFZjVGJNaC9OZzRpNHZ0K3p3Q0owNDFVNTlVSnBkZ0V3VncwOFFuNWdDOU9SQmhVaGVVd0I3aS9KVzNFVjNPdVFPc3VsVzY2Y1pCa3RaSll5REZGcTFUOC95MTJPRXFDRCtLRFN3TXFnMGVFTUdzaWlDWG9NMDNWYlFYeWJMbGVnOXRLY0lOT1Vac1plTks5ZXRmRGxXajdDMTFJTm12QXQ2ajZ1VDFTTVhPT2FEZ0tseXVqN0I5bUtDMG1haTN4ekJpWDYxTSszbzhxbllTakpFeml5ampCVkpqdzVreXMyUDNmY2l3cTNtanQxMGNMQ1J5U3lKcEFraVZkTkVNWmtvc2paZ2J0NlZJN24ySk5IbXllRUdvd3dXZ3Z0Z2QxWHAzcWJjQThQMVZmVnprR1ZaN0gyb04zdmZ6WEdUWjVMTUVHVllsVlNxN1Jhc3hrRjNSR1J2ZmUvSGtFTmZ1azJSSThyK0g3aXFXMDNjNzEydkFCRWN5cHZ4UDVYYis5WGxOVHdGWXBaVWxHczR5TzQrOHhHdTZxOW42RTNNSmRpKy9RRURKd3ZOU2d3QUFBPT0iLCJyb2xlIjoiV1J3QUFCK0xDQUFBQUFBQUJBQ2xXZHR1M0RZUS9SVmlueElnRGtqcVFxb2YwWWU4QmtWQWtkdzFEVW1VU2NvdFV2VGZTMHJhdGQxYUpzZDVzcUcxNSt6Y3pwa1pmZi83Sk0yUGU2T2RjSStMRVQ4dWJwbnQ2VGQwNHJ4dVQxOU8wL2o4U0VqdHZVVUNpZGtncGRIaUYrR005VWpGUjA5aU1FSUttejVRMnV0eDF0TjlOT0JOV05MelpPRDNiNmQvdnJ5SFdMK0xhSkUzUHVoUklDbFUwQkxkcmMvdmtGZTR4UlFHeGdnN0FuUGFoOVV5R3Uxa2duVm11a1RJSGlXb00yZTBnMEx4TEpTMGsxK0dFRjJ6ZytpdEU4ckd6NER4b3ppTDQ0MTRVTW1QaVZTNEJmclJWZ2YyYlF6UEhPUzlRTE96U293UllKNDdYSEdnQTZRNUJJaGxaWWQ3aXlhQmJPOEVTa21uTlFFQlVGSWZKZjI1dHBBSzBtNlpiaGdzMDdUdGpqTDliRjhZYzdVT0sxblNzZVB3M0t6UHdvUmtQNUMycm1EaHI2dUNieDhUL0NTUU1oY1R4SkNBQmt3eE1NOVZkOVRvL3dOeXNXaFZTc2N5WUFMRllaVG1jZDRrcm9qNHArNGpOclMrOG9DOU9xLzU3MnJHZ1BubmVldUpwajdFVW96eGZQYWxrR2dlRm45ajN0amxzV3VCWmJaMmJRNUlmVVhCbWY0cjBuK0ZQVjRFdzRCb1FUMUhJREd0RWtJckRIV0VIL0h0YS9zK09Jcys5Y0xyejZuSTV2UTN3bTlwQWxaQVZSUTZNMTBqVnNNOGFrbEpoYm1nalh2SkFjcmpsZ0JGa1JjbFo0YzZMNU0wZHRvSTV5RmxTcDVoa1d0WlFlVGt1RE56QzFORzB0RUM2MnJjczBLQnZOeFV4N3I3bHZXVUVlME5MRUs4eGdVK2FMWFBXeFNZYjlMaHZIakZCM0VDU2kwaUxtTFVVN0QrNmhTdzlUbk5DNzIwNCt6MEUvb1VxZXh6eEJsSHpJRU5RMXBTRURSbjQzL3RqZ0RIVklweHZrM1VNTzkxeTRGRGNOWGwrLzBzWkpUQy9ldTNVTWxxOGxrL0wyUGtyS3NtZ3NVa3o4RVhKU2NkUHRqYUpaUm81ckNzNWh0Q2dMMU5DNzYvQ2YwK01rSkhPb3E3ZlB3SGR4dElvTlpaUGpaVHZ5ckVnZ2xRdmlObDUybHZPdXRyNmNPa2xNVkt5RnEzSWNodGxtWVlSZ3lNdDNrQ2VtVSsvV0lUNStuYkxnaEU1SG5FT2E0SGFYYnJNUU11ZjZ5RXYyZjl1RlZTVThIYW1MVTBUM054MXF5NkpnTElTV2pnWGxZWG1IZGFpclRzYjZJejRZNEE5K09xemhlczA0K0xkbVlWdDIzc2hQWUZyd3RpNVpYWW5PRGd1MGpCQ3V0MVhIVGFDR0FtTDUxSnkxT3MyZUJFV0VGZTQ3M2Y1S3hnWS9MNmZEdFpOTkFOTUUrdlhwdXJOeGUzZnVpMWU0cGJwNE91QTNsRzhYRzNGT2haVHluWlZpbGd0OVJkSGltcE5iUUxDOW9rMmUyZ2EwVlhFSm5MVllWYW1Bb3gxcFpZRC9QSG1KeDBoNGZDRithTlBsL1hiaUJwMEtyRS9FVWtwWGdTdUFIZVFGcGVzTlpIKzM3YjZmVWtwTlVyQVQ0UVRHRGRSb3U2emNTcDI2NjY5NEM3Q2xoSkdCZmsydmpreEw2bkFFK0VVYmhMZlBCMkc4a21Va01waVpjMFdRSnc0bnIyQXE1YUpjdFAvUG5UcGpPQm5IR0ZZVk45eTB0SSs0SFNHbmplYUV2cXgrNmRWbE5nN2RTOGdEWFhzK25kZHR5S0FSSkkvRnlHNjZrRE9tRVc0QzFDNzlmYUJqaVFzWUo1THhpMUh1azRCWTRCckgzbkZQL2F1ci9INEJOZ1NRR2x5aWMwQXRnK2FCYzU0Mnk4VDBjZ0EzMHQ4czdSUHlyeEt2WXkzUnhpd3owUE5KTkZTZ1JZMEpwam5mUGJVQ0hUMjdJWG0vc2lnYjZRTjJ0cWZ2WFc2bGZlOGZEbXZ5MTR5OFB0RlZVNjBHVFM4Y2UvOEtsd2xsa2NBQUE9IiwibmJmIjoxNzIxOTI3MTkxLCJleHAiOjE3MjE5MzQzOTEsImlhdCI6MTcyMTkyNzE5MSwiaXNzIjoiaHR0cDovL3dlYmRlc2VudjUucHJvZGFtIiwiYXVkIjoiaHR0cDovL2E1ZDBkZDM2LTgxYjEtNDU3ZC04ZWEyLTkzZTcyZDU4NDBlZiJ9.c_-TockTwe4bFVd8eJ6U0PGmZFDj8omUH1WNtYfO1sU'
  };

  const payload = {
    "codigoCpfAluno": cpf,
    "nomeAluno": "Fabricio Avila",
    "dataNascimentoAluno": "1995-01-17T20:29:25.157Z",
    "codigoSexoAluno": "masculino",
    "codigoNacionalidadeAluno": "29",
    "codigoPaisMec": 0,
    "dataEntradaPais": "2024-06-10T20:29:25.157Z",
    "siglaUfNascimentoAluno": "string",
    "codigoMunicipioNascimento": 0,
    "nomeMaeAluno": "Teste teste dos testess",
    "codigoSexoMae": "feminino",
    "nomePaiAluno": "Teste teste dos testes",
    "codigoSexoPai": "masculino",
    "codigoOperador": "10"
  }

  const res = http.post(url, JSON.stringify(payload), { headers: headers });
  //console.log('CPF >>>>>>>>>>>>>>>>>>>>', cpf);
  //console.log('Response body: >>>>>>>>>>>>>>>>>>>>', res.body);

  PostCpfDuration.add(res.timings.duration);
  PostCpfRate.add(1);
  PostCpfFailRate.add(res.status == 0 || res.status > 399);
  PostCpfSuccessRate.add(res.status < 399);

  let durationMsg = 'Falha na execução dos testes'

  if (!check(res, {
    'Validate if status code returns 200': (r) => r.status === 200,
    'Validate maximum duration': (r) => r.timings.duration < 3000
  })) {
    fail(durationMsg);

  }
  sleep(1);
}