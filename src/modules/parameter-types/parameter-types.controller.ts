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
import { ParameterTypesService } from './parameter-types.service';
import { CreateParameterTypesDto } from './dtos/create-parameter-types.dto';
import { UpdateParameterTypesDto } from './dtos/update-parameter-types.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ParameterType } from 'src/database';

@Controller('parameter-types')
export class ParameterTypesController {
	constructor(private readonly parameterTypesService: ParameterTypesService) {}

	@Get()
	getParameterTypes() {
		return this.parameterTypesService.getParameterTypes();
	}

	@Get(':id')
	getParameterTypeById(@Param('id', ParseUUIDPipe) id: string) {
		return this.parameterTypesService.getParameterTypeById(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: ParameterType,
	})
	createParameterType(@Body() createParameterType: CreateParameterTypesDto) {
		return this.parameterTypesService.createParameterType(createParameterType);
	}

	@Patch(':id')
	updateParameterType(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateParameterType: UpdateParameterTypesDto,
	) {
		return this.parameterTypesService.updateParameterType(
			id,
			updateParameterType,
		);
	}

	@Delete(':id')
	deleteParameterType(@Param('id', ParseUUIDPipe) id: string) {
		return this.parameterTypesService.deleteParameterType(id);
	}
}
