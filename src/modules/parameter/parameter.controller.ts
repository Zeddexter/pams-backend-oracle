import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { CreateParameterDto } from './dtos/create-parameter.dto';
import { UpdateParameterDto } from './dtos/update-parameter.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Parameter } from 'src/database';

@ApiTags('Parameter')
@Controller('parameter')
export class ParameterController {
	constructor(private readonly parameterService: ParameterService) {}

	@Get()
	getParameters() {
		return this.parameterService.getParameters();
	}

	@Get(':id')
	getParameterById(@Param('id', ParseUUIDPipe) id: string) {
		return this.parameterService.getParameterById(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Parameter,
	})
	createParameter(@Body() createParameter: CreateParameterDto) {
		return this.parameterService.createParameter(createParameter);
	}

	@Patch(':id')
	updateParameter(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateParameter: UpdateParameterDto,
	) {
		return this.parameterService.updateParameter(id, updateParameter);
	}

	@Delete(':id')
	deleteParameter(@Param('id', ParseUUIDPipe) id: string) {
		return this.parameterService.deleteParameter(id);
	}
}
