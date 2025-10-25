import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule, Patient, Service } from 'src/database';
import { ConfigModule } from '@nestjs/config';
import { Sale } from 'src/database/entities/sale.entity';
import { SubService } from 'src/database/entities/sub-services.entity';

@Module({
	controllers: [PatientController],
	providers: [PatientService],
	imports: [
		TypeOrmModule.forFeature([
			Patient,
			Sale,
			Service,
			SubService,
			DoctorSchedule,
		]),
		ConfigModule,
	],
	exports: [TypeOrmModule, PatientService],
})
export class PatientModule {}
