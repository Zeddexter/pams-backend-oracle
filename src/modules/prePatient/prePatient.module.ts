import { Module } from '@nestjs/common';
import { PrePatientController } from './prepatient.controller';
import { prePatientService } from './prePatient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PrePatient } from 'src/database/entities/prePatients.entity';
import { Appointment } from 'src/database';

@Module({
	controllers: [PrePatientController],
	providers: [prePatientService],
	imports: [TypeOrmModule.forFeature([PrePatient, Appointment]), ConfigModule],
	exports: [TypeOrmModule],
})
export class PrePatientModule {}
