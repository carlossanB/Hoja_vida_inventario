import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service.js';

@Controller('asignaciones')
export class AsignacionesController {

  constructor(private readonly asignacionesService: AsignacionesService) { }

  @Get('activa/:equipoId')
  obtenerActiva(@Param('equipoId') equipoId: string) {
    return this.asignacionesService.obtenerAsignacionActiva(+equipoId);
  }

  @Get()
  findAll() {
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionesService.findOne(+id);
  }

  @Post()
  create(@Body() datos: any) {
    return this.asignacionesService.create(datos);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() datos: any) {
    return this.asignacionesService.update(+id, datos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionesService.remove(+id);
  }
}