import { Module } from '@nestjs/common';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoService } from './pontuacao.service';

@Module({
  controllers: [PontuacaoController],
  providers: [PontuacaoService],
  exports: [PontuacaoService], // para o módulo de avaliações usar depois
})
export class PontuacaoModule {}
