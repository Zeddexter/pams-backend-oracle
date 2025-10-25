// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from './error-handler.model';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		if (exception instanceof CustomException) {
			const status = exception.getStatus();
			const errorResponse = exception.getResponse();

			return response.status(status).json({
				...(typeof errorResponse === 'object' && errorResponse !== null
					? errorResponse
					: {}),
				timestamp: new Date().toISOString(),
				path: request.url,
			});
		}

		// Manejo de otros tipos de errores
		// ...
	}
}
