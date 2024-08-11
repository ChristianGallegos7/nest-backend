import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { EmpleosService } from './empleos.service';
import { CreateEmpleoDto } from './dto/create-empleo.dto';
import { AuthGuard } from '../auth/guards/auth/auth.guard';

@Controller('empleos')
export class EmpleosController {
  constructor(private readonly empleosService: EmpleosService) { }

  @Post()
  create(@Body() createEmpleoDto: CreateEmpleoDto) {
    return this.empleosService.create(createEmpleoDto);
  }

  @Get()
  findAll() {
    return this.empleosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleosService.findOne(+id);
  }

  @Post(':id/postularse')
  @UseGuards(AuthGuard)
  postularse(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id; // Obtener el ID del usuario logueado
    return this.empleosService.postularse(+id, userId);
  }
}
