import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Responsable } from '../entities/responsable.entity.js';
import { ResponsablesService } from './responsables.service.js';
import { ResponsablesController } from './responsables.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Responsable])],
  controllers: [ResponsablesController],
  providers: [ResponsablesService],
  exports: [ResponsablesService], // por si lo necesitamos en otros módulos
})
export class ResponsablesModule {}
