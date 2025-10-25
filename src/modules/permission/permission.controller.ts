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
import { PermissionService } from './permission.service';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/database';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Get()
	getPermissions() {
		return this.permissionService.getPermissions();
	}

	@Get(':id')
	getPermissionById(@Param('id', ParseUUIDPipe) id: string) {
		return this.permissionService.getPermissionById(id);
	}

	@Get('user/:id')
	getPermissionXIdUser(@Param('id', ParseUUIDPipe) id: string) {
		return this.permissionService.getPermissionXIdUser(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Permission,
	})
	createPermission(@Body() createPermission: CreatePermissionDto) {
		return this.permissionService.createPermission(createPermission);
	}

	@Patch(':id')
	updatePermission(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updatePermission: UpdatePermissionDto,
	) {
		return this.permissionService.updatePermission(id, updatePermission);
	}

	@Delete(':id')
	deletePermission(@Param('id', ParseUUIDPipe) id: string) {
		return this.permissionService.deletePermission(id);
	}
}
