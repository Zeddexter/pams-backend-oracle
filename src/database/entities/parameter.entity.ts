import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ParameterType } from './parameter-types.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('parameters')
export class Parameter {
  @ApiProperty({ description: 'Identificador único del parámetro (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del parámetro' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Descripción del parámetro', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Código único del parámetro',
    example: 'PARAM_TYPE_01',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  // 🔹 Relación ManyToOne con ParameterType
  @ApiProperty({ type: () => ParameterType })
  @ManyToOne(() => ParameterType, (parameterType) => parameterType.parameters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parametertypeid' })
  parametertype: ParameterType;
}
