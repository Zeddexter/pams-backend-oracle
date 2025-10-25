import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateParameterDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsString()
	code: string;

	@ApiProperty()
	@IsString()
	parametertypeid: string;
}
