import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { DoctorSchedule } from 'src/database';
import { CreateDoctorScheduleDto, FilterDoctorScheduleDto } from './dtos';

@ApiTags('doctor-schedule')
@Controller('doctor-schedule')
export class DoctorScheduleController {
	constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

	@Get()
	@ApiCreatedResponse({
		description: 'Get all doctor schedule',
		type: DoctorSchedule,
	})
	async findAll() {
		return await this.doctorScheduleService.getAll();
	}

	@Get('filter')
	@ApiCreatedResponse({
		description: 'Get filter doctor schedule',
		type: DoctorSchedule,
	})
	async getFilter(@Query() filters: FilterDoctorScheduleDto) {
		const items = await this.doctorScheduleService.getFilters(filters);
		return {
			message: 'Filtered items fetched successfully',
			items,
		};
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: DoctorSchedule,
	})
	create(@Body() body: CreateDoctorScheduleDto) {
		return this.doctorScheduleService.create(body);
	}

	@Get(':id')
	@ApiCreatedResponse({
		description: 'Get doctor schedule by id',
		type: DoctorSchedule,
	})
	async getById(@Param('id', ParseUUIDPipe) id: string) {
		return await this.doctorScheduleService.getById(id);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() body: CreateDoctorScheduleDto,
	) {
		return await this.doctorScheduleService.update(id, body);
	}

	@Post('appointment/:id/patient')
	@ApiCreatedResponse({
		description: 'Paciente agregado al horario',
		type: DoctorSchedule,
	})
	async addPatient(
		@Param('id') id: string,
		@Body('patientId') patientId: string,
	) {
		return this.doctorScheduleService.addPatient(id, patientId);
	}

	@Delete('appointment/:id/patient/:patientId')
	@ApiCreatedResponse({
		description: 'Paciente quitado del horario',
		type: DoctorSchedule,
	})
	async removePatient(
		@Param('id') id: string,
		@Param('patientId') patientId: string,
	) {
		return this.doctorScheduleService.removePatient(id, patientId);
	}
}
