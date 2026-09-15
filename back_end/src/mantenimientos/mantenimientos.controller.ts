import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { MantenimientosService } from './mantenimientos.service.js';

// Controlador para gestionar las rutas de /mantenimientos
@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  // GET /mantenimientos/equipo/:equipoId -> Historial de mantenimientos de un equipo
  // NOTA: Debe ir antes de ':id' para evitar que se interprete 'equipo' como un id
  @Get('equipo/:equipoId')
  obtenerPorEquipo(@Param('equipoId') equipoId: string) {
    return this.mantenimientosService.obtenerPorEquipo(+equipoId);
  }

  // GET /mantenimientos -> Lista todos los mantenimientos
  @Get()
  findAll() {
    return this.mantenimientosService.findAll();
  }

  // GET /mantenimientos/:id -> Busca un mantenimiento específico por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mantenimientosService.findOne(+id);
  }

  // POST /mantenimientos -> Guarda un nuevo mantenimiento en la base de datos
  @Post()
  create(@Body() datos: any) {
    return this.mantenimientosService.create(datos);
  }

  // PUT /mantenimientos/:id -> Actualiza un mantenimiento existente
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() datos: any) {
    return this.mantenimientosService.update(+id, datos);
  }

  // PATCH /mantenimientos/:id -> Soporta actualización parcial
  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() datos: any) {
    return this.mantenimientosService.update(+id, datos);
  }

  // DELETE /mantenimientos/:id -> Elimina un mantenimiento de la base de datos
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mantenimientosService.remove(+id);
  }
}
