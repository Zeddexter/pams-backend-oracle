import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission, Role } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto, UpdateRoleDto } from './dtos';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
	) {}

	async createRole(createRole: CreateRoleDto) {
		const { permissions, ...roleData } = createRole;
		try {
			let permissionsEntities: Permission[] = [];
			if (permissions) {
				permissionsEntities = await this.permissionRepository.find({
					where: permissions.map((permissionId) => ({ id: permissionId })),
				});
			}

			const role = await this.roleRepository.create({
				...roleData,
				permissions: permissionsEntities,
			});
			return await this.roleRepository.save(role);
		} catch (error) {
			console.log(error);
		}
	}

	async getRoles() {
		return await this.roleRepository.find({
			relations: ['permissions'],
		});
	}

	async getRoleById(id: string) {
		console.log(id);
		const role = this.roleRepository
			.createQueryBuilder('role')
			.leftJoin('role.users', 'users')
			.where('users.id = :id', { id })
			.getMany();

		if (!role) {
			throw new NotFoundException('Role not found');
		}
		return await role;
	}

	async updateRole(id: string, updateRole: UpdateRoleDto) {
		this.getRoleById(id);

		const { permissions, ...roleData } = updateRole;

		let permissionsEntities: Permission[] = [];
		if (permissions && permissions.length) {
			permissionsEntities = await this.permissionRepository.find({
				where: permissions.map((permissionId) => ({ id: permissionId })),
			});
		}

		const role = await this.roleRepository.preload({
			id: id,
			...roleData,
			permissions: permissionsEntities,
		});

		return await this.roleRepository.save(role);
	}

	async assignPermissionToRole(
		roleId: string,
		permissionId: string,
	): Promise<void> {
		const role = await this.roleRepository.findOne({
			where: { id: roleId },
			relations: ['permissions'],
		});
		const permission = await this.permissionRepository.findOne({
			where: { id: permissionId },
		});

		if (role && permission) {
			role.permissions.push(permission);
			await this.roleRepository.save(role);
		}
	}

	async deleteRole(id: string) {
		const role = await this.getRoleById(id);
		if (!role) {
			throw new NotFoundException('Role not found');
		}
		return await this.roleRepository.remove(role);
	}
}
