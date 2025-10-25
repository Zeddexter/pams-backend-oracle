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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Menu } from 'src/database';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}
	@Get()
	findAll() {
		return this.menuService.getAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.menuService.getById(id);
	}

	@Get('user/:id')
	findRole(@Param('id', ParseUUIDPipe) id: string) {
		return this.menuService.getMenuXRole(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Menu,
	})
	create(@Body() createMenuDto: CreateMenuDto) {
		return this.menuService.create(createMenuDto);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateMenuDto: UpdateMenuDto,
	) {
		return this.menuService.update(id, updateMenuDto);
	}

	@Delete(':id')
	delete(@Param('id', ParseUUIDPipe) id: string) {
		return this.menuService.delete(id);
	}
}
