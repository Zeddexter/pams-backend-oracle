import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FiltersSaleDto {
	@ApiProperty()
	@IsDateString()
	@IsOptional()
	date: Date;

	@ApiProperty()
	@IsString()
	@IsOptional()
	specialityId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	userId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	typeDocument: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	numDocument: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	names: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	serialNumber: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	status: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	dateAppointment: string;
}
