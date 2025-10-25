import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityShared } from 'src/common/models';

@Entity('diagnosis')
export class Diagnosis extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del diagnóstico (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Código del diagnóstico', example: 'A09' })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @ApiProperty({ description: 'Descripción del diagnóstico' })
  @Column({ type: 'varchar', length: 450 })
  description: string;

  @ApiProperty({
    description: 'Indica si el diagnóstico está activo (true/false)',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isactive: boolean;
}
