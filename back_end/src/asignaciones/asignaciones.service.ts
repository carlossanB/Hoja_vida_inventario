import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Asignacion } from '../entities/asignacion.entity.js';
import { Responsable } from '../entities/responsable.entity.js';

// Este servicio gestiona las asignaciones de equipos a los responsables
@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Responsable)
    private readonly responsableRepository: Repository<Responsable>,
  ) {}

  // Buscar la asignación activa de un equipo (sin fecha de devolución)
  async obtenerAsignacionActiva(equipoId: number) {
    return await this.asignacionRepository.findOne({
      where: {
        equipo: { id: equipoId },
        fechaDevolucion: IsNull(),
      },
      relations: {
        equipo: true,
        responsable: true,
      },
    });
  }

  // Listar todas las asignaciones con sus relaciones
  async findAll() {
    return await this.asignacionRepository.find({
      relations: {
        equipo: true,
        responsable: true,
      },
      order: { id: 'DESC' },
    });
  }

  // Buscar una asignación por su ID
  async findOne(id: number) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
      relations: {
        equipo: true,
        responsable: true,
      },
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID #${id} no encontrada`);
    }

    return asignacion;
  }

  // Crear una nueva asignación
  async create(datos: any) {
    const payload: any = { ...datos };

    // Si viene fechaAsignacion vacía, colocamos la fecha actual
    if (!payload.fechaAsignacion) {
      payload.fechaAsignacion = new Date();
    }

    // Permitimos recibir el ID del equipo en distintos formatos (equipoId, equipo_id o equipo)
    if (datos.equipoId || datos.equipo_id) {
      payload.equipo = { id: datos.equipoId ?? datos.equipo_id };
    } else if (typeof datos.equipo === 'number' || typeof datos.equipo === 'string') {
      payload.equipo = { id: Number(datos.equipo) };
    }

    // Procesar responsable: puede ser un objeto, una cédula o un nombre nuevo escrito libremente
    let cedulaResponsable = '';
    let nombreResponsable = '';
    let areaResponsable = 'General';

    if (typeof datos.responsable === 'object' && datos.responsable !== null) {
      cedulaResponsable = datos.responsable.cedula ? String(datos.responsable.cedula).trim() : '';
      nombreResponsable = datos.responsable.nombre ? String(datos.responsable.nombre).trim() : '';
      areaResponsable = datos.responsable.area ? String(datos.responsable.area).trim() : 'General';
    } else if (datos.responsableCedula || datos.responsable_cedula) {
      cedulaResponsable = String(datos.responsableCedula ?? datos.responsable_cedula).trim();
      nombreResponsable = datos.responsableNombre ? String(datos.responsableNombre).trim() : '';
      areaResponsable = datos.responsableArea ? String(datos.responsableArea).trim() : 'General';
    } else if (typeof datos.responsable === 'string' && datos.responsable.trim()) {
      const texto = datos.responsable.trim();
      // Si el texto parece ser solo números, lo tratamos como cédula; de lo contrario como nombre
      if (/^\d+$/.test(texto)) {
        cedulaResponsable = texto;
      } else {
        nombreResponsable = texto;
      }
    }

    // Si tenemos cédula, buscamos o creamos el responsable
    if (cedulaResponsable) {
      let respExistente = await this.responsableRepository.findOne({
        where: { cedula: cedulaResponsable },
      });

      if (!respExistente && nombreResponsable) {
        respExistente = this.responsableRepository.create({
          cedula: cedulaResponsable,
          nombre: nombreResponsable,
          area: areaResponsable || 'General',
          activo: true,
        });
        await this.responsableRepository.save(respExistente);
      }
      payload.responsable = { cedula: cedulaResponsable };
    } else if (nombreResponsable) {
      // Si solo nos dieron el nombre, buscamos si ya existe por nombre
      let respExistente = await this.responsableRepository.findOne({
        where: { nombre: nombreResponsable },
      });

      if (!respExistente) {
        // Generamos una cédula interna si no se proporcionó
        const nuevaCedula = `RESP-${Date.now().toString().slice(-6)}`;
        respExistente = this.responsableRepository.create({
          cedula: nuevaCedula,
          nombre: nombreResponsable,
          area: areaResponsable || 'General',
          activo: true,
        });
        await this.responsableRepository.save(respExistente);
      }
      payload.responsable = { cedula: respExistente.cedula };
    }

    const nueva = this.asignacionRepository.create(payload as Partial<Asignacion>);
    const guardada = await this.asignacionRepository.save(nueva);

    // Devolvemos la asignación con los datos del equipo y responsable cargados
    const asignacionId = Array.isArray(guardada) ? guardada[0].id : guardada.id;
    return await this.findOne(asignacionId);
  }

  // Actualizar una asignación (por ejemplo, registrar fechaDevolucion)
  async update(id: number, datos: any) {
    await this.findOne(id); // Verifica que exista

    const payload: any = { ...datos };

    if (datos.equipoId || datos.equipo_id) {
      payload.equipo = { id: datos.equipoId ?? datos.equipo_id };
    } else if (typeof datos.equipo === 'number' || typeof datos.equipo === 'string') {
      payload.equipo = { id: Number(datos.equipo) };
    }

    if (datos.responsableCedula || datos.responsable_cedula) {
      payload.responsable = { cedula: String(datos.responsableCedula ?? datos.responsable_cedula) };
    } else if (typeof datos.responsable === 'string' || typeof datos.responsable === 'number') {
      payload.responsable = { cedula: String(datos.responsable) };
    }

    await this.asignacionRepository.save({ id, ...payload });
    return await this.findOne(id);
  }

  // Eliminar una asignación
  async remove(id: number) {
    await this.findOne(id); // Verifica que exista
    return await this.asignacionRepository.delete(id);
  }
}


