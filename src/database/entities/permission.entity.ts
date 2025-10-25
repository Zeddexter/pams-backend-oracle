import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('permissions')
export class Permission {
  @ApiProperty({ description: 'Identificador único del permiso (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del permiso', example: 'CREATE_USER' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({ description: 'Descripción del permiso' })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  // 🔹 Relación ManyToMany con roles
  @ApiProperty({ type: () => Role, isArray: true })
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
