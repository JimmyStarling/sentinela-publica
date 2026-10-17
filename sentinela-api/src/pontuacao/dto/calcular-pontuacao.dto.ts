import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { StatusResposta } from '../pontuacao.types';

export class DominioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(StatusResposta, { each: true })
  respostas: StatusResposta[];
}

export class CalcularPontuacaoDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DominioDto)
  dominios: DominioDto[];
}
