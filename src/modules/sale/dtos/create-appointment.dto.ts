import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
	@ApiProperty()
	@IsDateString()
	date: string;

	// @ApiProperty()
	// @IsString()
	// @IsOptional()
	// hour: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	status: string;
}
