import { PontuacaoService } from './pontuacao.service';
import { NivelMaturidade, StatusResposta as S } from './pontuacao.types';

describe('PontuacaoService', () => {
  const service = new PontuacaoService();

  it('tudo conforme = 100 e nível ALTO', () => {
    const r = service.calcular([{ nome: 'Acesso', respostas: [S.CONFORME, S.CONFORME] }]);
    expect(r.notaGeral).toBe(100);
    expect(r.nivelGeral).toBe(NivelMaturidade.ALTO);
  });

  it('tudo não conforme = 0 e nível CRITICO', () => {
    const r = service.calcular([{ nome: 'Backup', respostas: [S.NAO_CONFORME, S.NAO_CONFORME] }]);
    expect(r.notaGeral).toBe(0);
    expect(r.nivelGeral).toBe(NivelMaturidade.CRITICO);
  });

  it('parcial vale metade', () => {
    const r = service.calcular([{ nome: 'Logs', respostas: [S.CONFORME, S.PARCIAL, S.NAO_CONFORME, S.NAO_CONFORME] }]);
    expect(r.dominios[0].nota).toBe(37.5);
    expect(r.dominios[0].nivel).toBe(NivelMaturidade.CRITICO);
  });

  it('"Não se aplica" sai do cálculo', () => {
    const r = service.calcular([{ nome: 'Acesso', respostas: [S.CONFORME, S.NAO_SE_APLICA, S.NAO_CONFORME] }]);
    expect(r.dominios[0].nota).toBe(50);
    expect(r.dominios[0].perguntasAplicaveis).toBe(2);
    expect(r.dominios[0].naoSeAplica).toBe(1);
  });

  it('domínio só com "Não se aplica" fica sem nota e não entra na média', () => {
    const r = service.calcular([
      { nome: 'A', respostas: [S.NAO_SE_APLICA] },
      { nome: 'B', respostas: [S.CONFORME] },
    ]);
    expect(r.dominios[0].nota).toBeNull();
    expect(r.dominios[0].nivel).toBeNull();
    expect(r.notaGeral).toBe(100);
  });

  it('sem nenhuma pergunta aplicável: nota geral nula', () => {
    const r = service.calcular([{ nome: 'A', respostas: [S.NAO_SE_APLICA] }]);
    expect(r.notaGeral).toBeNull();
    expect(r.nivelGeral).toBeNull();
  });

  it('nota geral é a média dos domínios (não das perguntas)', () => {
    const r = service.calcular([
      { nome: 'A', respostas: [S.CONFORME] },                         // 100
      { nome: 'B', respostas: [S.NAO_CONFORME, S.NAO_CONFORME, S.NAO_CONFORME] }, // 0
    ]);
    expect(r.notaGeral).toBe(50);
  });

  it.each([
    [39.9, NivelMaturidade.CRITICO],
    [40, NivelMaturidade.BAIXO],
    [59.9, NivelMaturidade.BAIXO],
    [60, NivelMaturidade.MEDIO],
    [79.9, NivelMaturidade.MEDIO],
    [80, NivelMaturidade.ALTO],
  ])('limiar: nota %p => %p', (nota, nivel) => {
    expect(service.classificar(nota)).toBe(nivel);
  });

  it('é determinístico: mesmas respostas, mesmo resultado', () => {
    const entrada = [{ nome: 'A', respostas: [S.CONFORME, S.PARCIAL, S.NAO_SE_APLICA] }];
    expect(service.calcular(entrada)).toEqual(service.calcular(entrada));
  });
});
