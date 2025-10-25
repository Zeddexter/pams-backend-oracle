import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, Role, Submenu } from 'src/database';
import { Repository } from 'typeorm';
import { CreateSubmenuDto, UpdateSubmenuDto } from './dtos';

@Injectable()
export class SubmenuService {
	constructor(
		@InjectRepository(Submenu)
		private readonly subMenuRepository: Repository<Submenu>,
		@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
	) {}

	async findAll() {
		try {
			return await this.subMenuRepository.find({
				relations: ['menu', 'roles', 'roles.permission'],
				order: {
					orders: 'ASC', // Ordenar por la propiedad 'order' en orden ascendente
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	async findOne(id: string) {
		const subMenu = await this.subMenuRepository.findOne({
			where: { id: id },
			relations: ['menu', 'roles', 'roles.permissions'],
		});
		if (!subMenu) {
			throw new NotFoundException('Submenu not found');
		}
		return subMenu;
	}

	async create(createSubMenuDto: CreateSubmenuDto) {
		const { idMenu, roles, ...subMenuData } = createSubMenuDto;

		try {
			if (!roles || roles.length === 0) {
				throw new BadRequestException('Roles are required');
			}

			const rolesEntities = await this.getRolesEntities(roles);

			const menu = await this.menuRepository
				.createQueryBuilder('menu')
				.where('menu.id = :id', { id: idMenu })
				.getOne();

			if (!menu) {
				throw new NotFoundException('Menu not found');
			}

			const subMenu = this.subMenuRepository.create({
				...subMenuData,
				menu: menu,
				roles: rolesEntities,
			});

			return await this.subMenuRepository.save(subMenu);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	/**
	 * Updates a submenu with the specified ID.
	 *
	 * @param id - The ID of the submenu to update.
	 * @param updateSubmenuDto - The data to update the submenu with.
	 * @returns The updated submenu.
	 */
	async update(id: string, updateSubmenuDto: UpdateSubmenuDto) {
		try {
			const { roles, ...partialDto } = updateSubmenuDto;
			// Iniciar una transacción
			return await this.subMenuRepository.manager.transaction(
				async (transactionalEntityManager) => {
					// Obtener el menú y los roles en una sola consulta

					let menu: Menu;
					if (partialDto && partialDto.idMenu) {
						menu = await transactionalEntityManager
							.getRepository(Menu)
							.createQueryBuilder('menu')
							.where('menu.id = :id', { id: partialDto.idMenu })
							.getOne();

						if (!menu) {
							throw new NotFoundException(
								`Menu with id ${partialDto.idMenu} not found`,
							);
						}
					}

					let roleEntities: Role[] = [];
					if (roles && roles.length > 0) {
						roleEntities = await this.roleRepository
							.createQueryBuilder('roles')
							.where('roles.id in (:...roles)', { roles })
							.getMany();

						if (roleEntities.length !== roles.length) {
							throw new NotFoundException('One or more roles not found');
						}
					}

					// Obtener el submenu existente
					const submenu = await this.subMenuRepository
						.createQueryBuilder('submenus')
						.where('submenus.id = :id', { id })
						.leftJoinAndSelect('submenus.roles', 'roles')
						.getOne();

					if (!submenu) {
						throw new NotFoundException(`Submenu with id ${id} not found`);
					}

					// Actualizar los campos condicionalmente
					if (menu) {
						submenu.menu = menu;
					}

					if (roleEntities.length > 0) {
						submenu.roles = roleEntities;
					}

					Object.assign(submenu, partialDto);

					// Guardar el submenú actualizado
					return await transactionalEntityManager.save(submenu);
				},
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async delete(id: string) {
		try {
			const submenu = await this.subMenuRepository
				.createQueryBuilder('submenus')
				.leftJoinAndSelect('submenus.roles', 'roles')
				.where('submenus.id = :id', { id })
				.andWhere('ROWNUM = 1') // Limitar a un solo resultado
				.getOne();

			if (!submenu) {
				throw new NotFoundException(`Submenu with id ${id} not found`);
			}

			// Eliminar las referencias en la tabla de relación
			await this.subMenuRepository
				.createQueryBuilder('submenu')
				.relation(Submenu, 'roles')
				.of(submenu)
				.remove(submenu.roles);

			const deleted = await this.subMenuRepository.delete(id);

			return {
				...deleted,
				ok: true,
			};
		} catch (error) {
			console.log(error);
		}
	}

	private async getRolesEntities(roles: string[]): Promise<Role[]> {
		const rolesEntities = await this.roleRepository.find({
			where: roles.map((roleId) => ({ id: roleId })),
		});

		if (rolesEntities.length !== roles.length) {
			throw new NotFoundException('One or more roles not found');
		}

		return rolesEntities;
	}
}
