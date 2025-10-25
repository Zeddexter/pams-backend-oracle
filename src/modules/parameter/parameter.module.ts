import { Module } from '@nestjs/common';
import { ParameterController } from './parameter.controller';
import { ParameterService } from './parameter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameter, ParameterType } from 'src/database';

@Module({
	controllers: [ParameterController],
	providers: [ParameterService],
	imports: [TypeOrmModule.forFeature([Parameter, ParameterType])],
})
export class ParameterModule {}
