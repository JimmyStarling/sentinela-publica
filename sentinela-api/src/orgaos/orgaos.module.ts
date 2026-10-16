import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgaosController } from './orgaos.controller';
import { OrgaosService } from './orgaos.service';
import { Orgao } from './entities/orgao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orgao])],
  controllers: [OrgaosController],
  providers: [OrgaosService],
  exports: [OrgaosService],
})
export class OrgaosModule {}