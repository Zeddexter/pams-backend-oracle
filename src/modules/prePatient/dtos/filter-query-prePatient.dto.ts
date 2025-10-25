import { ApiProperty } from '@nestjs/swagger';
import {
	IsOptional,
	IsString,
	IsInt,
	Min,
	Max,
	IsNumber,
} from 'class-validator';

export class FilterQueryPrePatientDto {
	@IsOptional()
	@IsString()
	numDocument?: string;

	@IsOptional()
	@IsString()
	names?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	dateAppointment: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	limit?: number;

	@IsOptional()
	@IsInt()
	@IsNumber()
	@Min(1)
	page?: number;
}
