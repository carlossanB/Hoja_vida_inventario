import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Res } from '@nestjs/common';
import { EquiposService } from './equipos.service.js';

// Controlador para recibir las peticiones HTTP de /equipos
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  // GET /equipos -> Devuelve todos los equipos
  @Get()
  findAll() {
    return this.equiposService.findAll();
  }

  // GET /equipos/:id/exportar-word -> Genera y descarga la Hoja de Vida en .docx usando la plantilla oficial
  // IMPORTANTE: este endpoint debe estar ANTES de @Get(':id') para que NestJS no lo confunda
  @Get(':id/exportar-word')
  async exportarWord(@Param('id') id: string, @Res() res: any) {
    const { buffer, filename } = await this.equiposService.generarHojaVidaWord(+id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  // GET /equipos/:id -> Devuelve un solo equipo por su ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equiposService.findOne(+id);
  }

  // POST /equipos -> Crea un nuevo equipo en la base de datos
  @Post()
  create(@Body() datos: any) {
    return this.equiposService.create(datos);
  }

  // PUT /equipos/:id -> Actualiza un equipo completo
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() datos: any) {
    return this.equiposService.update(+id, datos);
  }

  // PATCH /equipos/:id -> También soporta actualizar por PATCH
  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() datos: any) {
    return this.equiposService.update(+id, datos);
  }

  // DELETE /equipos/:id -> Elimina un equipo por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }
}
