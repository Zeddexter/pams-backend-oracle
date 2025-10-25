// En tu controlador NestJS
import {
	Body,
	Controller,
	Get,
	HttpException,
	Param,
	ParseUUIDPipe,
	Post,
} from '@nestjs/common';
import {
	ReniecNamesResponseDto,
	ReniecDniRequestDto,
	ReniecDniRequestDataDto,
	CreateReniecDto,
} from './dtos/reniec.dto';
import { ReniecService } from './reniec.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { Reniec } from 'src/database/entities/reniec.entity';

@Controller('reniec')
export class ReniecController {
	constructor(
		private readonly httpService: HttpService,
		private readonly reniecService: ReniecService,
	) {}

	@Get('dni/:number')
	async getDni(@Param('number') dniNumber: string) {
		console.log('dniNumber - controller', dniNumber);
		return this.reniecService.getDniInfo(dniNumber);
	}
	@Post('dninombres')
	@ApiCreatedResponse({
		description:
			'Consulta realizada exitosamente. Devuelve los nombres encontrados en RENIEC.',
		type: ReniecDniRequestDataDto,
	})
	@ApiBody({
		description: 'Datos requeridos para la consulta a RENIEC',
		type: ReniecDniRequestDataDto,
	})
	async getNamesByDni(
		@Body() reniecFilter: ReniecDniRequestDataDto,
	): Promise<ReniecNamesResponseDto> {
		return this.reniecService.getNamesReniec(reniecFilter);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Reniec,
	})
	@ApiBody({
		description: 'Datos requeridos para la consulta a RENIEC',
		type: CreateReniecDto,
	})
	async createRegistro(
		@Body() createReniec: CreateReniecDto,
	): Promise<CreateReniecDto> {
		//const existingRecord = await this.reniecService.findOne(createReniec.dni);

		return this.reniecService.createRegistro(createReniec);
	}

	@Get()
	async getAll() {
		return this.reniecService.findAll();
	}
}
