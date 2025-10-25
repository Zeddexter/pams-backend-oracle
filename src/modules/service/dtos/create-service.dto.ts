import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	isActive: boolean;

	@ApiProperty()
	@IsString()
	subserviceId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	saleId: string;
}
