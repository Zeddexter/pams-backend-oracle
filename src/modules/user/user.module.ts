import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, Sale, User } from 'src/database/entities';
import { ConfigModule } from '@nestjs/config';
import { Specialty } from 'src/database/entities/specialty.entity';
import { DoctorSchedule } from 'src/database/entities';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypeOrmModule.forFeature([
			User,
			Role,
			Permission,
			Specialty,
			Sale,
			DoctorSchedule,
		]),
		ConfigModule,
	],
	exports: [TypeOrmModule, UserService],
})
export class UserModule {}
