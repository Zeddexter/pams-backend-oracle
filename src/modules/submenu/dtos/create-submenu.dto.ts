import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsInt,
	IsArray,
	IsUUID,
	ArrayNotEmpty,
} from 'class-validator';

export class CreateSubmenuDto {
	@ApiProperty()
	@IsString()
	label: string;

	@ApiProperty()
	@IsString()
	path: string;

	@ApiProperty()
	@IsString()
	icon: string;

	@ApiProperty()
	@IsString()
	idMenu: string; // Relación con el menú al que pertenece

	@ApiProperty()
	@IsInt()
	@Optional()
	orders: number;

	@ApiProperty({
		type: [String],
	})
	@IsArray()
	@ArrayNotEmpty({ message: 'roles should not be empty' })
	@IsUUID('4', { each: true, message: 'each value in roles must be a UUID' })
	roles: string[]; // Relación con los roles que pueden acceder a este submenu
}
