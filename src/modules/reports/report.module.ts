import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Patient, Sale, Service, Specialty, SubService } from 'src/database';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [ReportController],
	providers: [ReportService],
	imports: [
		TypeOrmModule.forFeature([Sale, SubService, Specialty, Patient, Service]),
		ConfigModule,
	],
})
export class ReportModule {}
