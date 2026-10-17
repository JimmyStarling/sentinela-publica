import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PontuacaoService } from './pontuacao.service';
import { CalcularPontuacaoDto } from './dto/calcular-pontuacao.dto';

@Controller('pontuacao')
export class PontuacaoController {
  constructor(private readonly service: PontuacaoService) {}

  // Endpoint sem estado: recebe respostas e devolve o resultado.
  // Útil para testar o motor antes de existirem as avaliações (RF-03/04).
  @Post('calcular')
  @HttpCode(HttpStatus.OK)
  calcular(@Body() dto: CalcularPontuacaoDto) {
    return this.service.calcular(dto.dominios);
  }
}
