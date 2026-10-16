import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgaoDto } from './create-orgao.dto';

export class UpdateOrgaoDto extends PartialType(CreateOrgaoDto) {}