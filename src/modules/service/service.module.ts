import { Module } from '@nestjs/common';
import { ServiceController } from './service.controllet';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service, SubService } from 'src/database';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [ServiceController],
	providers: [ServiceService],
	imports: [TypeOrmModule.forFeature([Service, SubService]), ConfigModule],
	exports: [],
})
export class ServiceModule {}
