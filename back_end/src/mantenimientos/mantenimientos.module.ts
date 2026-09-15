import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mantenimiento } from '../entities/mantenimiento.entity.js';
import { MantenimientosService } from './mantenimientos.service.js';
import { MantenimientosController } from './mantenimientos.controller.js';

@Module({
  // Importamos la entidad Mantenimiento para inyectar su repositorio
  imports: [TypeOrmModule.forFeature([Mantenimiento])],
  controllers: [MantenimientosController],
  providers: [MantenimientosService],
  exports: [MantenimientosService],
})
export class MantenimientosModule {}
