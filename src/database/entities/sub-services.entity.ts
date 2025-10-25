import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './services.entity';

@Entity('sub_services')
export class SubService {
  @ApiProperty({ description: 'Identificador único del subservicio (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 450 })
  description: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  @ApiProperty({ type: () => Service, isArray: true })
  @OneToMany(() => Service, (service) => service.subservice)
  services: Service[];
}
