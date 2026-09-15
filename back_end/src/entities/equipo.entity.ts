import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Esta clase representa la tabla "equipos" en PostgreSQL
@Entity('equipos')
export class Equipo {

  // ID autonumérico
  @PrimaryGeneratedColumn()
  id: number;

  // Número de inventario (ejemplo: TPROPCL-103) mapeado a la columna numero_inventario
  @Column({ name: 'numero_inventario', type: 'varchar', length: 50, unique: true })
  numeroInventario: string;

  // Tipo de activo (computador portátil, de escritorio, etc.)
  @Column({ name: 'tipo_activo', type: 'varchar', length: 50, default: 'COMPUTADOR PORTÁTIL' })
  tipoActivo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  marca: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serial: string;

  @Column({ name: 'fecha_adquisicion', type: 'date', nullable: true })
  fechaAdquisicion: Date;

  // Estado físico del equipo (BUENO, REGULAR, MALO)
  @Column({ name: 'estado_fisico', type: 'varchar', length: 30, default: 'BUENO' })
  estadoFisico: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  procesador: string;

  @Column({ name: 'memoria_ram', type: 'varchar', length: 50, nullable: true })
  memoriaRam: string;

  @Column({ name: 'disco_duro', type: 'varchar', length: 100, nullable: true })
  discoDuro: string;

  @Column({ name: 'tarjeta_grafica', type: 'varchar', length: 100, nullable: true })
  tarjetaGrafica: string;

  @Column({ name: 'sistema_operativo', type: 'varchar', length: 100, nullable: true })
  sistemaOperativo: string;

  @Column({ name: 'licencia_office', type: 'varchar', length: 100, nullable: true })
  licenciaOffice: string;

  @Column({ type: 'text', nullable: true })
  accesorios: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  garantia: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
