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
import { SubmenuService } from './submenu.service';
import { CreateSubmenuDto, UpdateSubmenuDto } from './dtos';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Submenu } from 'src/database';

@ApiTags('Submenu')
@Controller('submenu')
export class SubmenuController {
	constructor(private readonly submenuService: SubmenuService) {}

	@Get()
	findAll() {
		return this.submenuService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.submenuService.findOne(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Submenu,
	})
	create(@Body() createSubMenuDto: CreateSubmenuDto) {
		return this.submenuService.create(createSubMenuDto);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateSubmenuDto: UpdateSubmenuDto,
	) {
		return this.submenuService.update(id, updateSubmenuDto);
	}

	@Delete(':id')
	delete(@Param('id', ParseUUIDPipe) id: string) {
		return this.submenuService.delete(id);
	}
}
