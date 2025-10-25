import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { Role } from './role.entity';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('submenus')
export class Submenu extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del submenú (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  path: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string | null;

  @ApiProperty()
  @Column({ type: 'integer', default: 0 })
  orders: number;

  // 🔹 Relación con Menu (muchos submenús pertenecen a un menú)
  @ApiProperty({ type: () => Menu })
  @ManyToOne(() => Menu, (menu) => menu.submenus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuid' })
  menu: Menu;

  // 🔹 Relación con Roles (muchos a muchos)
  @ApiProperty({ type: () => Role, isArray: true })
  @ManyToMany(() => Role, (role) => role.submenus)
  roles: Role[];
}
