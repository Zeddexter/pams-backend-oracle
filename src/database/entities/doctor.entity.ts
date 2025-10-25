import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('doctors')
export class Doctor {
  @ApiProperty({ description: 'Identificador único del doctor (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
