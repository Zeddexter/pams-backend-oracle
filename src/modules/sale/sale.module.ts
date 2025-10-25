import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	Appointment,
	Patient,
	Sale,
	Service,
	Specialty,
	User,
} from 'src/database';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
	controllers: [SaleController],
	providers: [SaleService],
	imports: [
		TypeOrmModule.forFeature([
			Sale,
			Patient,
			User,
			Specialty,
			Service,
			Appointment,
		]),
		ConfigModule,
	],
})
export class SaleModule {}
