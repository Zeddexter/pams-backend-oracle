import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
