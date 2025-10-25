import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Role, Submenu, User } from 'src/database';
import { MenuService } from './menu.service';
import { SubmenuService } from '../submenu/submenu.service';

@Module({
	controllers: [MenuController],
	providers: [MenuService, SubmenuService],
	imports: [TypeOrmModule.forFeature([Menu, Submenu, Role, User])],
})
export class MenuModule {}
