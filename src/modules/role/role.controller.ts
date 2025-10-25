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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/database';

@ApiTags('Role')
@Controller('role')
export class AuthController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiOkResponse({
		description: 'List of roles',
		type: Role,
		isArray: true,
	})
	getRoles() {
		return this.roleService.getRoles();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get role by ID' })
	@ApiResponse({ status: 200, description: 'Role found', type: Role })
	@ApiNotFoundResponse({ description: 'Role not found' })
	getRoleById(@Param('id', ParseUUIDPipe) id: string) {
		return this.roleService.getRoleById(id);
	}

	@Post()
	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		type: Role,
	})
	@ApiBody({
		description: 'The role to create',
		type: Role,
		examples: {
			example1: {
				summary: 'Example role',
				description: 'An example of a role to be created',
				value: {
					name: 'admin',
					description: 'Administrador',
				},
			},
		},
	})
	createRole(@Body() createRole: CreateRoleDto) {
		return this.roleService.createRole(createRole);
	}

	@Patch(':id')
	updateRole(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateRole: CreateRoleDto,
	) {
		return this.roleService.updateRole(id, updateRole);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a role by ID' })
	@ApiOkResponse({ description: 'Role deleted successfully' })
	@ApiNotFoundResponse({ description: 'Role not found' })
	deleteRole(@Param('id', ParseUUIDPipe) id: string) {
		return this.roleService.deleteRole(id);
	}

	@Post(':roleId/permission/:permissionId')
	assignPermissionToRole(
		@Param('roleId', ParseUUIDPipe) roleId: string,
		@Param('permissionId', ParseUUIDPipe) permissionId: string,
	) {
		return this.roleService.assignPermissionToRole(roleId, permissionId);
	}
}
