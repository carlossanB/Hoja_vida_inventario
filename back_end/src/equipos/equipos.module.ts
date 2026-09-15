import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../entities/equipo.entity.js';
import { EquiposService } from './equipos.service.js';
import { EquiposController } from './equipos.controller.js';
import { Asignacion } from '../entities/asignacion.entity.js';
import { Mantenimiento } from '../entities/mantenimiento.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Asignacion, Mantenimiento])],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule { }