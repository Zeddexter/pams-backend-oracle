import { Module } from '@nestjs/common';
import { SubserviceController } from './subservice.controller';
import { SubserviceService } from './subservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service, SubService } from 'src/database';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [SubserviceController],
	providers: [SubserviceService],
	imports: [TypeOrmModule.forFeature([SubService, Service]), ConfigModule],
})
export class SubserviceModule {}
