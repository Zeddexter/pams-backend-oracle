import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSubserviceDto {
	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	isActive: boolean;
}
