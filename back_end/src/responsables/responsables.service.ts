import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsable } from '../entities/responsable.entity.js';

// Este servicio se encarga de hablar con la base de datos
@Injectable()
export class ResponsablesService {

    // Inyectamos el repositorio de Responsable
    constructor(
        @InjectRepository(Responsable)
        private responsableRepository: Repository<Responsable>,
    ) { }

    // Obtener todos los responsables
    async obtenerTodos() {
        return await this.responsableRepository.find();
    }

    // Buscar un responsable por cédula
    async obtenerPorCedula(cedula: string) {
        return await this.responsableRepository.findOne({
            where: { cedula },
        });
    }


    async crear(datos: Partial<Responsable>) {
        const nuevo = this.responsableRepository.create(datos);
        return await this.responsableRepository.save(nuevo);
    }


    async actualizar(cedula: string, datos: Partial<Responsable>) {
        await this.responsableRepository.update(cedula, datos);
        return await this.obtenerPorCedula(cedula);
    }


    async eliminar(cedula: string) {
        return await this.responsableRepository.delete(cedula);
    }
}