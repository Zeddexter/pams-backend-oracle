import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Permission, Role, Submenu, User } from 'src/database';
import { AuthController } from './role.controller';
import { RoleService } from './role.service';

@Module({
	controllers: [AuthController],
	providers: [RoleService],
	imports: [TypeOrmModule.forFeature([Role, User, Menu, Submenu, Permission])],
})
export class RoleModule {}
