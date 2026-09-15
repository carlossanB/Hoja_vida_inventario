import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from '../entities/asignacion.entity.js';
import { Responsable } from '../entities/responsable.entity.js';
import { AsignacionesService } from './asignaciones.service.js';
import { AsignacionesController } from './asignaciones.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asignacion, Responsable])],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [AsignacionesService],
})
export class AsignacionesModule { }