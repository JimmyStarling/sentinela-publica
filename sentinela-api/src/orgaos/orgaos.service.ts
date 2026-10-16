import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orgao } from './entities/orgao.entity';
import { CreateOrgaoDto } from './dto/create-orgao.dto';
import { UpdateOrgaoDto } from './dto/update-orgao.dto';

@Injectable()
export class OrgaosService {
  constructor(@InjectRepository(Orgao) private repo: Repository<Orgao>) {}

  async create(dto: CreateOrgaoDto) {
    if (await this.repo.existsBy({ nome: dto.nome })) {
      throw new ConflictException('Já existe um órgão com esse nome');
    }
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: number) {
    const orgao = await this.repo.findOne({ where: { id }, relations: { servicos: true } });
    if (!orgao) throw new NotFoundException('Órgão não encontrado');
    return orgao;
  }

  async update(id: number, dto: UpdateOrgaoDto) {
    const orgao = await this.findOne(id);
    return this.repo.save(Object.assign(orgao, dto));
  }

  async remove(id: number) {
    const orgao = await this.findOne(id);
    await this.repo.remove(orgao);
  }
}