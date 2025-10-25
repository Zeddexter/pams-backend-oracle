import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FiltersReportDto {
	@ApiProperty()
	@IsDateString()
	@IsOptional()
	startdate: Date;

	@ApiProperty()
	@IsDateString()
	@IsOptional()
	enddate: Date;
}
