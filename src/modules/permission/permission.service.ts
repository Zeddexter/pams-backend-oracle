import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/database';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    // ✅ Ya no necesitas especificar la conexión
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // 🔹 Obtener todas las permissions
  getPermissions() {
    return this.permissionRepository.find();
  }

  // 🔹 Obtener una permission por ID
  async getPermissionById(id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'], // asegúrate que en tu entidad esté en minúsculas
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  // 🔹 Crear permiso
  async createPermission(createPermission: CreatePermissionDto) {
    try {
      const permission = this.permissionRepository.create(createPermission);
      return await this.permissionRepository.save(permission);
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  // 🔹 Actualizar permiso
  async updatePermission(id: string, updatePermission: UpdatePermissionDto) {
    const findPermission = await this.permissionRepository.findOneBy({ id });
    if (!findPermission) {
      throw new NotFoundException('Permission not found');
    }

    const permission = await this.permissionRepository.preload({
      id,
      ...updatePermission,
    });

    return await this.permissionRepository.save(permission);
  }

  // 🔹 Eliminar permiso
  async deletePermission(id: string) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionRepository.remove(permission);
  }

  // 🔹 Buscar permisos por ID de usuario
  async getPermissionXIdUser(id: string) {
    try {
      return await this.permissionRepository
        .createQueryBuilder('permission')
        .leftJoin('permission.roles', 'roles')
        .leftJoin('roles.users', 'users')
        .where('users.id = :id', { id })
        .getMany();
    } catch (error) {
      console.error('Error fetching permissions by user ID:', error);
      throw error;
    }
  }
}
