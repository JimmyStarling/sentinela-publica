import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servico } from './entities/servico.entity';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { OrgaosService } from '../orgaos/orgaos.service';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico) private repo: Repository<Servico>,
    private orgaos: OrgaosService,
  ) {}

  async create(dto: CreateServicoDto) {
    const { orgaoId, ...dados } = dto;
    const orgao = await this.orgaos.findOne(orgaoId); // lança 404 se não existir
    return this.repo.save(this.repo.create({ ...dados, orgao }));
  }

  findAll(orgaoId?: number) {
    return this.repo.find({
      where: orgaoId ? { orgao: { id: orgaoId } } : {},
      relations: { orgao: true },
    });
  }

  async findOne(id: number) {
    const servico = await this.repo.findOne({ where: { id }, relations: { orgao: true } });
    if (!servico) throw new NotFoundException('Serviço não encontrado');
    return servico;
  }

  async update(id: number, dto: UpdateServicoDto) {
    const servico = await this.findOne(id);
    const { orgaoId, ...dados } = dto;
    if (orgaoId) servico.orgao = await this.orgaos.findOne(orgaoId);
    return this.repo.save(Object.assign(servico, dados));
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}