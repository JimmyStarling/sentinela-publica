import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrgaoDto {
  @IsString() @IsNotEmpty() @MaxLength(150)
  nome: string;

  @IsString() @IsNotEmpty() @MaxLength(150)
  responsavel: string;
}