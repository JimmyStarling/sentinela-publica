import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Orgao } from '../../orgaos/entities/orgao.entity';

export enum Criticidade { BAIXA = 'baixa', MEDIA = 'media', ALTA = 'alta' }
export enum TipoDado { PUBLICO = 'publico', INTERNO = 'interno', PESSOAL = 'pessoal', SENSIVEL = 'sensivel' }

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 150 })
  responsavel: string;

  @Column({ type: 'enum', enum: TipoDado })
  tipoDado: TipoDado;

  @Column({ type: 'enum', enum: Criticidade })
  criticidade: Criticidade;

  @ManyToOne(() => Orgao, (o) => o.servicos, { nullable: false, onDelete: 'RESTRICT' })
  orgao: Orgao;

  @CreateDateColumn() criadoEm: Date;
  @UpdateDateColumn() atualizadoEm: Date;
}