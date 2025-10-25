import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityShared } from 'src/common/models';
import { SubService } from './sub-services.entity';
import { Sale } from './sale.entity';

@Entity('services')
export class Service extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del servicio (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Descripción del servicio' })
  @Column({ type: 'varchar', length: 450 })
  description: string;

  @ApiProperty({ description: 'Estado del servicio (activo/inactivo)' })
  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  // 🔹 Relación ManyToOne con SubService
  @ApiProperty({
    type: () => SubService,
    description: 'Subservicio al que pertenece este servicio',
  })
  @ManyToOne(() => SubService, (subService) => subService.services, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sub_service_id' }) // ✅ snake_case PostgreSQL convention
  subservice?: SubService | null;

  // 🔹 Relación OneToMany con Sale
  @ApiProperty({
    type: () => Sale,
    isArray: true,
    description: 'Ventas asociadas a este servicio',
  })
  @OneToMany(() => Sale, (sale) => sale.service, { cascade: false })
  sales?: Sale[];
}
