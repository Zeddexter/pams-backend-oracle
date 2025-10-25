import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDoctorScheduleDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	start: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	end?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	userId?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	specialtyId?: string;
}
