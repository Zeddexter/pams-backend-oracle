import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reniec')
export class Reniec extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del registro (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Número de DNI', example: '72104563' })
  @Column({ type: 'varchar', length: 8 })
  dni: string;

  @ApiProperty({ description: 'Nombres completos' })
  @Column({ type: 'varchar', length: 355 })
  nombres: string;

  @ApiProperty({ description: 'Apellido paterno' })
  @Column({ type: 'varchar', length: 355 })
  apellido_paterno: string;

  @ApiProperty({ description: 'Apellido materno' })
  @Column({ type: 'varchar', length: 355 })
  apellido_materno: string;
}
