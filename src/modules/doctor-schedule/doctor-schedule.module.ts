import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorScheduleController } from './doctor-schedule.controller';
import { ConfigModule } from '@nestjs/config';
import { DoctorSchedule, Patient, Specialty, User } from 'src/database';

@Module({
	controllers: [DoctorScheduleController],
	providers: [DoctorScheduleService],
	imports: [
		TypeOrmModule.forFeature([DoctorSchedule, User, Specialty, Patient]),
		ConfigModule,
	],
	exports: [TypeOrmModule],
})
export class DoctorScheduleModule {}
