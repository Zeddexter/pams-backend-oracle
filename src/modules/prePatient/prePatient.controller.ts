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
import { prePatientService } from './prePatient.service';
import { CreatePrePatientDto } from './dtos';
import { UpdatePrePatientDto } from './dtos/update-prepatient.dto';
import { FilterQueryPrePatientDto } from './dtos/filter-query-prepatient.dto';

@Controller('prePatient')
export class PrePatientController {
	constructor(private readonly PrepatientService: prePatientService) {}
	@Post()
	async create(@Body() createPrePatient: CreatePrePatientDto) {
		return this.PrepatientService.create(createPrePatient);
	}

	@Get()
	async getAll() {
		return this.PrepatientService.findAll();
	}

	@Get('filter')
	async getItems(@Query() filters: FilterQueryPrePatientDto) {
		// Aquí puedes procesar los filtros
		const items = await this.PrepatientService.findItems(filters);
		return {
			message: 'Filtered items fetched successfully',
			items,
		};
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdatePrePatientDto,
	) {
		return this.PrepatientService.update(id, updateUserDto);
	}
}
