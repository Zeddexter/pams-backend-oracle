import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { FilterQueryPatientDto } from './dtos/filter-query-patient.dto';
import { PaginationParams } from 'src/common/interfaces/paginator-params.interface';
import { Pagination } from 'src/common/decorators/paginator.decorator';

@Controller('patient')
export class PatientController {
	constructor(private readonly patientService: PatientService) {}
	@Post()
	async create(@Body() createPatient: CreatePatientDto) {
		return this.patientService.create(createPatient);
	}

	@Get()
	async getAll(@Pagination() pagination: PaginationParams) {
		return this.patientService.findAll(
			pagination.page,
			pagination.limit,
			pagination.search,
		);
	}

	@Get('filter')
	async getItems(
		@Query() filters: FilterQueryPatientDto,
		@Pagination() pagination: PaginationParams,
	) {
		const items = await this.patientService.findItems(
			filters,
			pagination.page,
			pagination.limit,
		);
		return items;
	}

	@Get(':id')
	async getById(@Param('id', ParseUUIDPipe) id: string) {
		return this.patientService.findById(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdatePatientDto,
	) {
		return this.patientService.update(id, updateUserDto);
	}
}
