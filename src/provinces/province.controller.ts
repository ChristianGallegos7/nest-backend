import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProvinciasService } from './province.service';


@Controller('provincias')
export class ProvinciasController {
  constructor(private provinciasService: ProvinciasService) { }

  @Get()
  findAll() {
    return this.provinciasService.findAll();
  }

}
