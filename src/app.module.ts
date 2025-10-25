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

    // 🟦 Conexión PostgreSQL principal
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT ?? '5432'),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      synchronize: true, // ⚠️ Usa false en producción
      autoLoadEntities: true,
      logging: true,
    }),

    // 🔹 Módulos funcionales del sistema (importados desde modules.constant.ts)
    ...MODULES,

    // 🔹 Configuración de logs (Winston)
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
