import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Submenu } from './submenu.entity';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del menú (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Etiqueta o nombre del menú' })
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @ApiProperty({ description: 'Ícono asociado al menú' })
  @Column({ type: 'varchar', length: 255 })
  icon: string;

  @ApiProperty({ description: 'Orden de visualización del menú' })
  @Column({ type: 'integer', default: 0 })
  orders: number;

  @ApiProperty({ type: () => Submenu, isArray: true })
  @OneToMany(() => Submenu, (submenu) => submenu.menu, { cascade: true })
  submenus: Submenu[];
}
