import {
	Inject,
	Injectable,
	InternalServerErrorException,
	LoggerService,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, Role, Submenu, User } from 'src/database';
import { DataSource, In, Repository } from 'typeorm';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Submenu)
		private readonly subMenuRepository: Repository<Submenu>,
		private readonly dataSource: DataSource,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) {}

	getAll() {
		return this.menuRepository.find({
			relations: ['submenus', 'submenus.roles'],
			order: {
				orders: 'ASC', // Ordenar por la propiedad 'order' en orden ascendente
			},
		});
	}

	async getById(id: string) {
		try {
			const menu = await this.menuRepository
				.createQueryBuilder('MENU')
				.leftJoinAndSelect('MENU.SUBMENUS', 'SUBMENUS')
				.leftJoinAndSelect('SUBMENUS.ROLES', 'ROLES')
				.where('MENU.ID = :id', { id })
				.getOne();

			if (!menu) {
				throw new NotFoundException('Menu not found');
			}

			return menu;
		} catch (error) {
			this.logger.error('Error retrieving menu by ID', error);
			throw new InternalServerErrorException('Error retrieving menu');
		}
	}

	// async getMenuXRole(userId: string) {
	// 	try {
	// 		const user = await this.userRepository
	// 			.createQueryBuilder('USERS')
	// 			.leftJoinAndSelect('USERS.roles', 'ROLES')
	// 			.leftJoinAndSelect('ROLES.submenus', 'SUBMENUS')
	// 			.where('USERS.id = :userId', { userId })
	// 			.getOne();

	// 		this.logger.log(`User found: ${user?.id}`);

	// 		if (!user.roles || user.roles.length === 0) {
	// 			throw new NotFoundException('User has no roles');
	// 		}

	// 		const query = this.menuRepository
	// 			.createQueryBuilder('MENUS')
	// 			.leftJoinAndSelect('MENUS.submenus', 'SUBMENUS')
	// 			.leftJoin('SUBMENUS.roles', 'ROLES')
	// 			.leftJoin('ROLES.users', 'USERS')
	// 			.where('USERS.id = :userId', { userId })
	// 			.orderBy('MENUS.orders', 'ASC')
	// 			.addOrderBy('SUBMENUS.orders', 'ASC');

	// 		const menus = await query.getMany();

	// 		this.logger.log('Menus retrieved for user:', menus);

	// 		return menus;
	// 	} catch (error) {
	// 		this.logger.error('Error retrieving menus for the user', error);
	// 		throw new InternalServerErrorException(
	// 			'Error retrieving menus for the user',
	// 		);
	// 	}
	// }
	async getMenuXRole(userId: string) {
  try {
    // 1. Obtener IDs de submenús a los que el usuario tiene acceso
    const submenus = await this.subMenuRepository
      .createQueryBuilder('SUBMENUS')
      .select('SUBMENUS.menuId', 'menuId')
      .innerJoin('SUBMENUS.roles', 'ROLES')
      .innerJoin('ROLES.users', 'USERS')
      .where('USERS.id = :userId', { userId })
      .groupBy('SUBMENUS.menuId')
      .getRawMany();

    const menuIds = submenus.map((s) => s.menuId);
    if (menuIds.length === 0) {
      throw new NotFoundException('El usuario no tiene menús asignados.');
    }

    // 2. Traer solo los menús correspondientes
    const menus = await this.menuRepository.find({
      where: { id: In(menuIds) },
      relations: ['submenus'],
      order: { orders: 'ASC' },
    });

    return menus;
  } catch (error) {
    this.logger.error('Error retrieving menus for the user', error);
    throw new InternalServerErrorException('Error retrieving menus for the user');
  }
}


	async create(createMenuDto: CreateMenuDto) {
		try {
			const menu = this.menuRepository.create(createMenuDto);
			return await this.menuRepository.save(menu);
		} catch (error) {
			this.logger.error('Error creating menu', error);
			throw new InternalServerErrorException('Error creating menu');
		}
	}

	async update(id: string, updateMenuDto: UpdateMenuDto) {
		try {
			const menu = await this.menuRepository.preload({
				id: id,
				...updateMenuDto,
			});

			if (!menu) {
				throw new NotFoundException(`Menu with id ${id} not found`);
			}

			return await this.menuRepository.save(menu);
		} catch (error) {
			this.logger.error('Error updating menu', error);
			throw new InternalServerErrorException('Error updating menu');
		}
	}

	async delete(menuId: string) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			// 1. Obtener todos los submenus relacionados al menú
			const submenus = await queryRunner.manager.find(Submenu, {
				where: { menu: { id: menuId } },
			});

			const submenuIds = submenus.map((submenu) => submenu.id);

			if (submenuIds.length > 0) {
				// 2. Eliminar relaciones en roles_submenus
				await queryRunner.manager
					.createQueryBuilder()
					.delete()
					.from('roles_submenus')
					.where('submenuId IN (:...submenuIds)', { submenuIds })
					.execute();

				// 3. Eliminar submenus
				await queryRunner.manager
					.createQueryBuilder()
					.delete()
					.from(Submenu)
					.where('id IN (:...submenuIds)', { submenuIds })
					.execute();
			}

			// 4. Eliminar el menú
			await queryRunner.manager
				.createQueryBuilder()
				.delete()
				.from(Menu)
				.where('id = :menuId', { menuId })
				.execute();

			await queryRunner.commitTransaction();
		} catch (error) {
			// Si hay un error, deshacer la transacción
			await queryRunner.rollbackTransaction();
			this.logger.error('Error deleting menu', error);
		} finally {
			await queryRunner.release();
		}
	}
}
