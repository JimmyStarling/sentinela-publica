import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { Servico } from './entities/servico.entity';
import { OrgaosModule } from '../orgaos/orgaos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Servico]), OrgaosModule],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}