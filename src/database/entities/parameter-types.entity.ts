import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Parameter } from './parameter.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('parametertypes')
export class ParameterType {
  @ApiProperty({ description: 'Identificador único del tipo de parámetro (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Código único del tipo de parámetro' })
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @ApiProperty({ type: () => Parameter, isArray: true })
  @OneToMany(() => Parameter, (parameter) => parameter.parametertype, {
    cascade: true,
  })
  parameters: Parameter[];
}
