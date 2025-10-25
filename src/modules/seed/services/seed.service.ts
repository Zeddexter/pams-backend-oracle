import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, Role, User } from 'src/database';
import { Repository } from 'typeorm';
import { initialData } from '../data/seed-data';
import { RoleService } from 'src/modules/role/role.service';
import { CreateRoleDto } from 'src/modules/role/dtos';
import { MenuService } from 'src/modules/menu/menu.service';
import { CreateMenuDto } from 'src/modules/menu/dtos';
import { CreateSubmenuDto } from 'src/modules/submenu/dtos';

@Injectable()
export class SeedService {
	constructor(
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly roleService: RoleService,
		private readonly menuService: MenuService,
	) {}
	async runSeed() {
		// init roles
		await this.deleteTables();
		// await this.insertRole();
		// await this.insertMenu();
		// await this.insertMenu();

		// const adminUser = await this.insertUsers()
		// await Promise.all(adminUser)
		return 'SEED EXECUTED';
	}

	private async deleteTables() {
		await this.roleRepository.createQueryBuilder().delete().where({}).execute();

		await this.menuRepository.createQueryBuilder().delete().where({}).execute();

		await this.userRepository.createQueryBuilder().delete().where({}).execute();

		// this.roleRepository.createQueryBuilder()
	}

	private async insertRole() {
		const createRoles: CreateRoleDto[] = [
			{
				name: 'Administrador',
				description: 'Administrador',
			},
			{
				name: 'Doctores',
				description: 'Doctores',
			},
			{
				name: 'Programador Citas',
				description: 'Programador Citas',
			},
			{
				name: 'Admisión',
				description: 'Admisión',
			},
		];

		createRoles.forEach(async (el) => {
			await this.roleService.createRole(el);
		});
	}

	private async insertMenu() {
		const createMenus: CreateMenuDto[] = [
			{
				label: 'Configuración',
				icon: 'pi-cog',
				orders: 1,
			},
			{
				label: 'Opciones',
				icon: 'pi-briefcase',
				orders: 2,
			},
		];

		const submenus: CreateSubmenuDto[] = [
			{
				idMenu: '',
				path: '',
				icon: '',
				label: '',
				orders: 1,
				roles: [],
			},
		];

		createMenus.forEach(async (el) => {
			const { id } = await this.menuService.create(el);
		});
	}

	private async insertUsers() {
		const seedUsers = initialData.users;
		const users: User[] = [];
		// seedUsers.forEach((user) => {
		//     users.push(this.userRepository.create(user));
		// });

		// const dbUsers = await this.userRepository.save(seedUsers);

		// return dbUsers
		return true;
	}
}
