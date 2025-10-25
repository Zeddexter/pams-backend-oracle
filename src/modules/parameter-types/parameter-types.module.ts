import { Module } from '@nestjs/common';
import { ParameterTypesController } from './parameter-types.controller';
import { ParameterTypesService } from './parameter-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterType } from 'src/database/entities';

@Module({
	imports: [TypeOrmModule.forFeature([ParameterType])],
	controllers: [ParameterTypesController],
	providers: [ParameterTypesService],
})
export class ParameterTypesModule {}
