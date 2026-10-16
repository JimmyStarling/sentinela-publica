import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Criticidade, TipoDado } from '../entities/servico.entity';

export class CreateServicoDto {
  @IsString() @IsNotEmpty() @MaxLength(150) nome: string;
  @IsString() @IsNotEmpty() @MaxLength(150) responsavel: string;
  @IsEnum(TipoDado) tipoDado: TipoDado;
  @IsEnum(Criticidade) criticidade: Criticidade;
  @IsInt() orgaoId: number;
}