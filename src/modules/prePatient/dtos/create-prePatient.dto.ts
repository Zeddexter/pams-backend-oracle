import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CreateAppointmentDto } from 'src/modules/appointment/dtos/create-appointment';

export class CreatePrePatientDto {
	@ApiProperty()
	@IsString()
	lastName: string;

	@ApiProperty()
	@IsString()
	motherLastName: string;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	gender: string;

	@ApiProperty()
	@IsString()
	typeDocument: string;

	@ApiProperty()
	@IsString()
	numDocument: string;

	@ApiProperty()
	@IsString()
	// @Type(() => Date)
	birthDate: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	residence?: string | null;

	@ApiProperty()
	@IsString()
	departament: string;

	@ApiProperty()
	@IsString()
	province: string;

	@ApiProperty()
	@IsString()
	district: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	numberPhone?: string | null;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	isActive: boolean;

	@ApiProperty({ type: () => CreateAppointmentDto })
	@ValidateNested()
	@Type(() => CreateAppointmentDto)
	@IsOptional()
	appointment: CreateAppointmentDto;
}
