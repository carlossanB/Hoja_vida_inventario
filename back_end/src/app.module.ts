import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ResponsablesModule } from './responsables/responsables.module.js';
import { EquiposModule } from './equipos/equipos.module.js';
import { AsignacionesModule } from './asignaciones/asignaciones.module.js';
import { MantenimientosModule } from './mantenimientos/mantenimientos.module.js';

@Module({
  imports: [
    // Cargamos el archivo .env para leer las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuramos la conexion a PostgreSQL con TypeORM
    // Usamos forRootAsync para asegurarnos de que .env ya este cargado
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        // Convertimos a String para garantizar que siempre viaje como texto
        password: String(config.get('DB_PASSWORD') ?? ''),
        database: config.get<string>('DB_DATABASE', 'hoja_vida'),
        autoLoadEntities: true,
        // Lo dejamos en false para cuidar las tablas que ya creamos en PostgreSQL
        synchronize: false,
      }),
    }),

    // Modulo para manejar todo lo relacionado con responsables
    ResponsablesModule,

    EquiposModule,

    AsignacionesModule,

    MantenimientosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
