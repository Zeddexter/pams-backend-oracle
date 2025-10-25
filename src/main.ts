import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ErrorsInterceptor } from './core/services/error.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap');

	const config = new DocumentBuilder()
		.setTitle('PAMS BACKEND')
		.setDescription('Descripciones de APIS de PAMS')
		.setVersion('1.0')
		.addTag('Pams')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);
	app.setGlobalPrefix('api');

	app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // ✅ permite que se apliquen los @Type(() => Date)
    whitelist: true, // ✅ elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // ✅ lanza error si hay campos no permitidos
    transformOptions: {
      enableImplicitConversion: true, // ✅ convierte strings a Date, number, boolean, etc.
    },
  }),
);


	app.enableCors();
	app.useGlobalInterceptors(new ErrorsInterceptor());

	// Habilitar graceful shutdown de Nest (ANTES de listen)
	app.enableShutdownHooks();

	const port = Number(process.env.PORT) || 3000;
	await app.listen(port);

	// El resto de señales las maneja Nest. No llamar app.close() manual aquí.

	logger.log(`Application is running on: ${port}`);
}
bootstrap();
