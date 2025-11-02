import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MODULES } from './modules/modules.constant';
import { AppService } from './app.service';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';
dotenv.config();

try {
	oracledb.initOracleClient({ libDir: process.env.DB_CLIENT }); // Ruta al cliente Oracle Instant Client
} catch (err) {
	console.error('Error initializing Oracle Client:', err);
	process.exit(1);
}
@Module({
  imports: [
    // 🔹 Cargar variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🟠 Conexión Oracle principal
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.ORACLE_HOST,
      port: parseInt(process.env.ORACLE_PORT ?? '1521'),
      username: process.env.ORACLE_USERNAME,
      password: process.env.ORACLE_PASSWORD,
      serviceName: process.env.ORACLE_SERVICE_NAME,
      sid: process.env.ORACLE_SID || undefined,
      synchronize: false, // ⚠️ Usa false en producción
      autoLoadEntities: true,
      logging: true,
      connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE_NAME}`,
      extra: {
        // Opción útil cuando usas InstantClient local
        libDir: process.env.ORACLE_CLIENT,
      },
    }),

    // 🔹 Módulos funcionales
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
