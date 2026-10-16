import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrgaosService } from './orgaos.service';
import { CreateOrgaoDto } from './dto/create-orgao.dto';
import { UpdateOrgaoDto } from './dto/update-orgao.dto';

@Controller('orgaos')
export class OrgaosController {
  constructor(private readonly service: OrgaosService) {}

  @Post() create(@Body() dto: CreateOrgaoDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrgaoDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}