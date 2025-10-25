import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto, UpdateSpecialityDto } from './dtos';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger';

@Controller('specialty')
export class SpecialityController {
	constructor(private readonly specialityService: SpecialityService) {}

	@Post()
	async create(@Body() createSpeciality: CreateSpecialityDto) {
		return await this.specialityService.create(createSpeciality);
	}
	@Patch(':id')
	updateSpecialty(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateSpecialty: CreateSpecialityDto,
	) {
		return this.specialityService.update(id, updateSpecialty);
	}
	@Get()
	async getAll() {
		return this.specialityService.findAll();
	}

	@Get(':id')
	async specialityXUsers(@Param('id', ParseUUIDPipe) id: string) {
		return await this.specialityService.specialityXUsers(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a Specialty by ID' })
	@ApiOkResponse({ description: 'Specialty deleted successfully' })
	@ApiNotFoundResponse({ description: 'Specialty not found' })
	deleteRole(@Param('id', ParseUUIDPipe) id: string) {
		return this.specialityService.deleteSpecialty(id);
	}
}
