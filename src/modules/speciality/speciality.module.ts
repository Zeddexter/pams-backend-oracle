import { Module } from '@nestjs/common';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule, Sale, Specialty, User } from 'src/database';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [SpecialityController],
	providers: [SpecialityService],
	imports: [
		TypeOrmModule.forFeature([Specialty, User, Sale, DoctorSchedule]),
		ConfigModule,
	],
	exports: [TypeOrmModule],
})
export class SpecialityModule {}
