import {
	IsArray,
	IsBoolean,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@MinLength(1)
	numdocument: string;

	@ApiProperty()
	@IsString()
	typedocument: string;

	@ApiProperty()
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'The password must have a Uppercase, lowercase letter and a number',
	})
	password: string;

	@ApiProperty()
	@IsString()
	@MinLength(1)
	names: string;

	@ApiProperty()
	@IsString()
	@MinLength(1)
	lastname: string;

	@ApiProperty()
	@IsString()
	@MinLength(1)
	motherlastname: string;

	@ApiProperty()
	@IsArray()
	roles: string[];

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	isactive: boolean;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	specialties : string[];
}
