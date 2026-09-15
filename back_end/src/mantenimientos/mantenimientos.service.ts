import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mantenimiento } from '../entities/mantenimiento.entity.js';

@Injectable()
export class MantenimientosService {

  constructor(
    @InjectRepository(Mantenimiento)
    private mantenimientoRepository: Repository<Mantenimiento>,
  ) { }

  async findAll() {
    return await this.mantenimientoRepository.find({
      relations: {'equipo': true},
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    return await this.mantenimientoRepository.findOne({
      where: { id },
      relations: { 'equipo': true },
    });
  }

  async obtenerPorEquipo(equipoId: number) {
    return await this.mantenimientoRepository.find({
      where: { equipo: { id: equipoId } },
      relations: {'equipo': true},
      order: { fecha: 'DESC' },
    });
  }

  async create(datos: any) {
    const nuevo = this.mantenimientoRepository.create(datos);
    return await this.mantenimientoRepository.save(nuevo);
  }

  async update(id: number, datos: any) {
    await this.mantenimientoRepository.update(id, datos);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.mantenimientoRepository.delete(id);
  }
}