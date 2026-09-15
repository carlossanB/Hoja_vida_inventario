import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Equipo } from './equipo.entity.js';
import { Responsable } from './responsable.entity.js';

// Esta clase representa la tabla "asignaciones" en PostgreSQL
@Entity('asignaciones')
export class Asignacion {

  @PrimaryGeneratedColumn()
  id: number;

  // Relación con el equipo (llave foránea equipo_id)
  @ManyToOne(() => Equipo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipo;

  // Relación con el responsable (llave foránea responsable_cedula)
  @ManyToOne(() => Responsable)
  @JoinColumn({ name: 'responsable_cedula' })
  responsable: Responsable;

  // Fecha en que se asignó el equipo
  @Column({ name: 'fecha_asignacion', type: 'date' })
  fechaAsignacion: Date;

  // Fecha de devolución (si es null significa que la asignación sigue activa)
  @Column({ name: 'fecha_devolucion', type: 'date', nullable: true })
  fechaDevolucion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
