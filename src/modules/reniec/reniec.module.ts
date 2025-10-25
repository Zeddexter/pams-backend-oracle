import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Sale, Specialty, User } from 'src/database';
import { ConfigModule } from '@nestjs/config';
import { ReniecController } from './reniec.controller';
import { ReniecService } from './reniec.service';
import { HttpModule } from '@nestjs/axios';
import { Reniec } from 'src/database/entities/reniec.entity';

@Module({
	controllers: [ReniecController],
	providers: [ReniecService],
	imports: [
		TypeOrmModule.forFeature([Reniec, Patient]),
		HttpModule, // This makes HttpService available
		ConfigModule,
	],
	exports: [
		// TypeOrmModule
	],
})
export class ReniecModule {}
