import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/database/entities';

@Module({
	controllers: [AppointmentController],
	providers: [AppointmentService],
	imports: [TypeOrmModule.forFeature([Appointment])],
	exports: [],
})
export class AppointmentModule {}
