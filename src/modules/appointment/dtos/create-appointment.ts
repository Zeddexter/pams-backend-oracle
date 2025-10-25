import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StatusAppointment } from 'src/common/enums/status-appointment.enum';

export class CreateAppointmentDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	status: StatusAppointment;

	@ApiProperty()
	@IsString()
	dateappointment: string;
}
