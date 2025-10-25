import { Module } from '@nestjs/common';
import { SeedController } from './controllers/seed.controller';
import { SeedService } from './services/seed.service';
import { AuthModule } from '../auth/auth.module';
import { MenuModule } from '../menu/menu.module';
import { RoleModule } from '../role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Permission, Role, Submenu } from 'src/database';
import { RoleService } from '../role/role.service';
import { MenuService } from '../menu/menu.service';
@Module({
	controllers: [SeedController],
	providers: [SeedService, RoleService, MenuService],
	imports: [
		AuthModule,
		MenuModule,
		RoleModule,
		TypeOrmModule.forFeature([Role, Menu, Permission, Submenu]),
	],
})
export class SeedModule {}
