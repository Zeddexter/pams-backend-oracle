import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
	constructor(message: string, code: number = 601) {
		super(
			{
				code: code,
				message,
				error: 'Errores controlados',
			},
			HttpStatus.BAD_REQUEST, // O el código HTTP que prefieras
		);
	}
}
