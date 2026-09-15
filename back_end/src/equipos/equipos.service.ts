import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Equipo } from '../entities/equipo.entity.js';
import { Asignacion } from '../entities/asignacion.entity.js';
import { Mantenimiento } from '../entities/mantenimiento.entity.js';

// Este servicio se encarga de consultar y guardar equipos en la base de datos
@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepository: Repository<Mantenimiento>,
  ) {}

  // Obtener la lista de todos los equipos
  async findAll() {
    return await this.equipoRepository.find({
      order: { id: 'ASC' },
    });
  }

  // Buscar un equipo por su ID numérico
  async findOne(id: number) {
    const equipo = await this.equipoRepository.findOne({
      where: { id },
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID #${id} no encontrado`);
    }

    return equipo;
  }

  // Buscar un equipo por su número de inventario
  async findByInventario(numeroInventario: string) {
    return await this.equipoRepository.findOne({
      where: { numeroInventario },
    });
  }

  // Crear y guardar un nuevo equipo en PostgreSQL
  async create(datos: any) {
    const nuevoEquipo = this.equipoRepository.create(datos);
    return await this.equipoRepository.save(nuevoEquipo);
  }

  // Actualizar los datos de un equipo existente
  async update(id: number, datos: any) {
    await this.findOne(id); // Verifica que exista
    await this.equipoRepository.update(id, datos);
    return await this.findOne(id);
  }

  // Eliminar un equipo de la base de datos
  async remove(id: number) {
    // 1. Verificamos que el equipo exista antes de borrarlo
    const equipo = await this.findOne(id);

    // 2. Eliminamos asignaciones y mantenimientos asociados (limpieza segura)
    await this.asignacionRepository.delete({ equipo: { id } });
    await this.mantenimientoRepository.delete({ equipo: { id } });

    // 3. Eliminamos el equipo de la tabla
    await this.equipoRepository.delete(id);

    return { mensaje: `Equipo con ID #${id} eliminado correctamente`, equipo };
  }

  // Helper para formatear fechas a DD-MES-YYYY
  private formatearFechaDoc(fecha: any): string {
    if (!fecha) return '—';
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return String(fecha);
      const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const dia = String(d.getUTCDate()).padStart(2, '0');
      const mes = meses[d.getUTCMonth()];
      const anio = d.getUTCFullYear();
      return `${dia}-${mes}-${anio}`;
    } catch {
      return String(fecha);
    }
  }

  // Generar Hoja de Vida usando la plantilla maestra oficial Teams Pro con docxtemplater
  async generarHojaVidaWord(id: number): Promise<{ buffer: Buffer; filename: string }> {
    const equipo = await this.findOne(id);

    // 1. Obtener asignación activa si existe
    const asignacionActiva = await this.asignacionRepository.findOne({
      where: {
        equipo: { id },
        fechaDevolucion: IsNull(),
      },
      relations: {
        responsable: true,
      },
    });

    // 2. Obtener lista de mantenimientos del equipo
    const mantenimientosList = await this.mantenimientoRepository.find({
      where: {
        equipo: { id },
      },
      order: {
        fecha: 'ASC',
      },
    });

    // 3. Mapear filas de la tabla de mantenimiento
    const mantenimientosFormateados =
      mantenimientosList.length > 0
        ? mantenimientosList.map((m) => {
            let dia = '—';
            let mes = '—';
            let anio = '—';

            if (m.fecha) {
              try {
                const parts = String(m.fecha).split('-');
                if (parts.length === 3) {
                  // YYYY-MM-DD
                  anio = parts[0].slice(-2);
                  mes = parts[1];
                  dia = parts[2].slice(0, 2);
                } else {
                  const d = new Date(m.fecha);
                  if (!isNaN(d.getTime())) {
                    dia = String(d.getUTCDate()).padStart(2, '0');
                    mes = String(d.getUTCMonth() + 1).padStart(2, '0');
                    anio = String(d.getUTCFullYear()).slice(-2);
                  }
                }
              } catch {
                // Keep default
              }
            }

            return {
              dia,
              mes,
              anio,
              detalle: m.detalle || m.tipo || 'Mantenimiento registrado',
              firma: '',
              obs: m.observaciones || 'OMITIDO',
            };
          })
        : [
            {
              dia: '—',
              mes: '—',
              anio: '—',
              detalle: 'Sin mantenimientos registrados a la fecha',
              firma: '',
              obs: '—',
            },
          ];

    // 4. Mapear datos completos para docxtemplater
    const templateData = {
      tipoActivo: equipo.tipoActivo || 'COMPUTADOR PORTÁTIL',
      fechaAdquisicion: this.formatearFechaDoc(equipo.fechaAdquisicion),
      numeroInventario: equipo.numeroInventario || '',
      marca: equipo.marca || '—',
      modelo: equipo.modelo || '—',
      serial: equipo.serial || '—',
      estadoFisico: equipo.estadoFisico || 'BUENO',
      responsable: asignacionActiva?.responsable?.nombre
        ? asignacionActiva.responsable.nombre.toUpperCase()
        : 'SIN ASIGNAR (EN BODEGA)',
      fechaAsignacion: asignacionActiva?.fechaAsignacion
        ? this.formatearFechaDoc(asignacionActiva.fechaAsignacion)
        : this.formatearFechaDoc(equipo.fechaAdquisicion),
      procesador: equipo.procesador || 'OMITIDO',
      memoriaRam: equipo.memoriaRam || 'OMITIDO',
      discoDuro: equipo.discoDuro || 'OMITIDO',
      tarjetaGrafica: equipo.tarjetaGrafica || 'OMITIDO',
      sistemaOperativo: equipo.sistemaOperativo || 'OMITIDO',
      licenciaOffice: equipo.licenciaOffice || 'OMITIDO',
      accesorios: equipo.accesorios || 'CARGADOR CON ADAPTADOR DE CORRIENTE',
      garantia: equipo.garantia || '1 AÑO',
      observaciones: equipo.observaciones || 'OMITIDO',
      mantenimientos: mantenimientosFormateados,
    };

    // 5. Cargar plantilla maestra oficial
    const templatePath = path.resolve(process.cwd(), 'templates/hoja_de_vida_template.docx');
    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException('Plantilla maestra hoja_de_vida_template.docx no encontrada');
    }

    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(templateData);

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const safeInventario = equipo.numeroInventario
      ? equipo.numeroInventario.replace(/[^a-zA-Z0-9-_]/g, '_')
      : 'Equipo';
    const filename = `HojaVida_${safeInventario}.docx`;

    return { buffer, filename };
  }
}
