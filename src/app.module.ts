import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MODULES } from './modules/modules.constant';
import { AppService } from './app.service';

@Module({
  imports: [
    // 🔹 Cargar variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🟠 Conexión Oracle principal
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '1521'),
      username: process.env.DB_USERNAME ?? 'OraclePAMS',
      password: process.env.DB_PASSWORD ?? 'oracle',
      serviceName: process.env.SERVICE_NAME ?? 'XEPDB1',
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.SERVICE_NAME}`,
      synchronize: false, // ⚠️ No activar en producción
      autoLoadEntities: true,
      logging: true,
    }),

    // 🔹 Módulos funcionales (importa tus features aquí)
    ...MODULES,

    // 🔹 Logs con Winston
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, context }) =>
                `${timestamp} [${context || 'App'}] ${level}: ${message}`,
            ),
          ),
        }),
      ],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
