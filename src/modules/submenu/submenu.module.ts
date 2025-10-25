import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Role, Submenu } from 'src/database';
import { SubmenuController } from './subemenu.controller';
import { SubmenuService } from './submenu.service';

@Module({
	controllers: [SubmenuController],
	providers: [SubmenuService],
	imports: [TypeOrmModule.forFeature([Submenu, Menu, Role])],
})
export class SubmenuModule {}
