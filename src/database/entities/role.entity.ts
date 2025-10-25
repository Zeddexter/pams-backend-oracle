import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Submenu } from './submenu.entity';
import { BaseEntityShared } from 'src/common/models';
import { Permission } from './permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del rol (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del rol' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  // 🔹 Relación con usuarios
  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  // 🔹 Relación con submenús
  @ApiProperty({ type: () => Submenu, isArray: true })
  @ManyToMany(() => Submenu, (submenu) => submenu.roles)
  @JoinTable({
    name: 'roles_submenus',
    joinColumn: {
      name: 'rolesid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'submenuid',
      referencedColumnName: 'id',
    },
  })
  submenus: Submenu[];

  // 🔹 Relación con permisos
  @ApiProperty({ type: () => Permission, isArray: true })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'rolesid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionsid',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}
