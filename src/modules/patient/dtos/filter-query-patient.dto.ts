import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsNumber } from 'class-validator';

export class FilterQueryPatientDto {
	@IsOptional()
	@IsString()
	numdocument?: string;

	@IsOptional()
	@IsString()
	numhistory?: string;

	@IsOptional()
	@IsString()
	names?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsNumber()
	@Min(1)
	page?: number;
}
