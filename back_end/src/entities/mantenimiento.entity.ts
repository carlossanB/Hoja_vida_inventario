import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Equipo } from './equipo.entity.js';

// Esta clase representa la tabla "mantenimientos"
@Entity('mantenimientos')
export class Mantenimiento {

  @PrimaryGeneratedColumn()
  id: number;

  // Relación con el equipo
  @ManyToOne(() => Equipo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipo;

  // Fecha del mantenimiento
  @Column({ type: 'date' })
  fecha: Date;

  // Tipo de mantenimiento (Preventivo, Correctivo, etc.)
  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  // Detalle de lo que se hizo
  @Column({ type: 'text' })
  detalle: string;

  // Nombre del técnico que lo realizó
  @Column({ type: 'varchar', length: 100, nullable: true })
  tecnico: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
