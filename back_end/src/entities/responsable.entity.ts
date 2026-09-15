import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

// Esta clase representa la tabla "responsables" de la base de datos
@Entity('responsables')
export class Responsable {
  
  // La cédula es la clave principal (no usamos id numérico)
  @PrimaryColumn({ type: 'varchar', length: 20 })
  cedula: string;

  // Nombre completo de la persona
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  // Cargo que tiene (opcional)
  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo: string;

  // Área a la que pertenece
  @Column({ type: 'varchar', length: 50 })
  area: string;

  // Si la persona está activa o no
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Fecha en que se creó el registro
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
