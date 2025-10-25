import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityShared } from 'src/common/models';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { PrePatient } from './prePatients.entity';

@Entity('appointments')
export class Appointment extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único de la cita (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha y hora de la cita',
    example: '2025-10-20T10:00:00Z',
  })
  @Column({ type: 'timestamp', nullable: false })
  dateappointment: Date;

  @ApiProperty({
    description: 'Estado de la cita (pendiente, completada, cancelada, etc.)',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  // 🔹 Relación OneToOne con Sale (opcional)
  @ApiProperty({ type: () => Sale, description: 'Venta asociada a la cita' })
  @OneToOne(() => Sale, (sale) => sale.appointment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sale_id' })
  sale?: Sale | null;

  // 🔹 Relación OneToOne con PrePatient (opcional)
  @ApiProperty({
    type: () => PrePatient,
    description: 'Paciente preinscrito asociado a la cita',
  })
  @OneToOne(() => PrePatient, (prePatient) => prePatient.appointment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'pre_patient_id' })
  prepatient?: PrePatient | null;
}
