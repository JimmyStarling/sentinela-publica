import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Servico } from '../../servicos/entities/servico.entity';

@Entity('orgaos')
export class Orgao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  nome: string;

  @Column({ length: 150 })
  responsavel: string;

  @OneToMany(() => Servico, (s) => s.orgao)
  servicos: Servico[];

  @CreateDateColumn() criadoEm: Date;
  @UpdateDateColumn() atualizadoEm: Date;
}