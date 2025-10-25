import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StatusAppointment } from 'src/common/enums/status-appointment.enum';

export class FiltersAppointmentDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	specialtyid: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	userid: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	patientid: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	status: StatusAppointment;

	@ApiProperty()
	@IsString()
	@IsOptional()
	dateappointment: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	createdat: string;
}
