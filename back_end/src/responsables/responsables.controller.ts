import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResponsablesService } from './responsables.service.js';


@Controller('responsables')
export class ResponsablesController {
  
  constructor(private readonly responsablesService: ResponsablesService) {}

  @Get()
  obtenerTodos() {
    return this.responsablesService.obtenerTodos();
  }

  @Get(':cedula')
  obtenerUno(@Param('cedula') cedula: string) {
    return this.responsablesService.obtenerPorCedula(cedula);
  }

  @Post()
  crear(@Body() datos: any) {
    return this.responsablesService.crear(datos);
  }

  @Put(':cedula')
  actualizar(@Param('cedula') cedula: string, @Body() datos: any) {
    return this.responsablesService.actualizar(cedula, datos);
  }

  
  @Delete(':cedula')
  eliminar(@Param('cedula') cedula: string) {
    return this.responsablesService.eliminar(cedula);
  }
}
