import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    oracledb.initOracleClient({
      libDir: process.env.DB_CLIENT || 'C:\\app\\Administrator\\product\\11.2.0\\dbhome_1\\bin',
    });
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    await oracledb.createPool({
      user: process.env.DB_USERNAME || 'PAMS',
      password: process.env.DB_PASSWORD || 'oracle',
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.SERVICE_NAME}`,
    });

    logger.log('✅ Oracle Client inicializado correctamente');
  } catch (error) {
    logger.error('❌ Error inicializando Oracle Client:', error);
  }

  // 🚀 Crear app NestJS
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS completamente
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://192.168.1.13:4200',
      'http://192.168.1.13' // incluye este si accedes sin puerto
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Prefijo global para las rutas
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 3005;

  // ✅ Importante: escucha en toda la red
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 App corriendo en http://192.168.1.13:${port}/api`);
}

bootstrap();
