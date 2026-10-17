import { Injectable } from '@nestjs/common';
import {
  DominioEntrada,
  LIMIARES_NIVEL,
  NivelMaturidade,
  ResultadoDominio,
  ResultadoPontuacao,
  VALOR_RESPOSTA,
} from './pontuacao.types';

@Injectable()
export class PontuacaoService {
  /**
   * Função pura: as mesmas respostas sempre geram o mesmo resultado
   * (critério de aceite do MVP) e não depende de banco nem de usuário.
   */
  calcular(dominios: DominioEntrada[]): ResultadoPontuacao {
    const resultados = dominios.map((d) => this.calcularDominio(d));

    const notas = resultados
      .map((r) => r.nota)
      .filter((n): n is number => n !== null);

    // Média simples das notas dos domínios que têm nota (pesos iguais).
    const notaGeral = notas.length
      ? this.arredondar(notas.reduce((a, b) => a + b, 0) / notas.length)
      : null;

    return {
      notaGeral,
      nivelGeral: notaGeral === null ? null : this.classificar(notaGeral),
      dominios: resultados,
    };
  }

  private calcularDominio(dominio: DominioEntrada): ResultadoDominio {
    const valores = dominio.respostas
      .map((r) => VALOR_RESPOSTA[r])
      .filter((v): v is number => v !== null);

    const aplicaveis = valores.length;
    const nota = aplicaveis
      ? this.arredondar(
          (valores.reduce((a, b) => a + b, 0) / aplicaveis) * 100,
        )
      : null; // evita divisão por zero quando tudo é "Não se aplica"

    return {
      nome: dominio.nome,
      nota,
      nivel: nota === null ? null : this.classificar(nota),
      totalPerguntas: dominio.respostas.length,
      perguntasAplicaveis: aplicaveis,
      naoSeAplica: dominio.respostas.length - aplicaveis,
    };
  }

  classificar(nota: number): NivelMaturidade {
    return LIMIARES_NIVEL.find((l) => nota >= l.minimo)!.nivel;
  }

  private arredondar(valor: number): number {
    return Math.round(valor * 10) / 10;
  }
}
