import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Creamos la aplicacion de NestJS con nuestro modulo principal
  const app = await NestFactory.create(AppModule);

  // Activamos CORS para que el frontend pueda hacer peticiones sin que el navegador las bloquee
  app.enableCors();

  // Usamos el puerto que definimos en .env o el 3001 por defecto
  const puerto = process.env.PORT || 3001;

  await app.listen(puerto);
  console.log(`Servidor iniciado con exito en http://localhost:${puerto}`);
}

await bootstrap();
