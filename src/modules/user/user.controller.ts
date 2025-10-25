import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { changePasswordDto, CreateUserDto } from './dtos';
import { UpdateUserDto } from './dtos';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '../../database';
import { Pagination } from 'src/common/decorators/paginator.decorator';
import { PaginationParams } from 'src/common/interfaces/paginator-params.interface';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiCreatedResponse({
		type: User,
	})
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get('specialty-all')
	async getUserAllSpecialty() {
		return await this.userService.getUserXSpecialty();
	}

	@Get()
	@ApiCreatedResponse({
		description: 'Get all users',
		type: User,
	})
	getAll(@Pagination() pagination: PaginationParams) {
		return this.userService.findAll(
			pagination.page,
			pagination.limit,
			pagination.search,
		);
	}

	@Get(':id')
	getById(@Param('id', ParseUUIDPipe) id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(id, updateUserDto);
	}

	@Patch('change-password/:id')
	changePassword(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() password: changePasswordDto,
	) {
		return this.userService.changePassword(id, password);
	}
}
