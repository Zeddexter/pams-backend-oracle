import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateMenuDto {
	@ApiProperty()
	@IsString()
	label: string;

	@ApiProperty()
	@IsString()
	icon: string;

	@ApiProperty()
	@IsInt()
	@Optional()
	orders: number;
}
