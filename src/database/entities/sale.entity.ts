import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { Schedule } from './schedule.entity';
import { Patient } from './patients.entity';
import { User } from './user.entity';
import { Specialty } from './specialty.entity';
import { Appointment } from './appointment.entity';
import { Service } from './services.entity'; // ✅ corregido el import

@Entity('sales')
export class Sale extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único de la venta (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Precio total de la venta', example: 150.75 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;


   @ApiProperty({ description: 'Tipo de recibo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;
   @ApiProperty({ description: 'Tipo de recibo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  serie: string;

  @ApiProperty({ description: 'Número de recibo' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  numero: string;


//   // 🔹 Relación con Schedule
//   @ApiProperty({ type: () => Schedule, description: 'Horario asociado a la venta' })
//   @OneToOne(() => Schedule, (schedule) => schedule.sale, {
//     nullable: true,
//     onDelete: 'SET NULL',
//   })
//   @JoinColumn({ name: 'schedule_id' })
//   schedule?: Schedule | null;

  // 🔹 Relación con Appointment
  @ApiProperty({ type: () => Appointment, description: 'Cita asociada a la venta' })
  @OneToOne(() => Appointment, (appointment) => appointment.sale, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment | null;

  // 🔹 Relación con User
  @ApiProperty({ type: () => User, description: 'Usuario asociado a la venta' })
  @ManyToOne(() => User, (user) => user.sales, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  // 🔹 Relación con Patient
  @ApiProperty({ type: () => Patient, description: 'Paciente asociado a la venta' })
  @ManyToOne(() => Patient, (patient) => patient.sales, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient | null;

  // 🔹 Relación con Specialty
  @ApiProperty({ type: () => Specialty, description: 'Especialidad médica de la venta' })
  @ManyToOne(() => Specialty, (specialty) => specialty.sales, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'specialty_id' })
  specialty?: Specialty | null;

  // 🔹 Relación con Service
  @ApiProperty({ type: () => Service, description: 'Servicio médico asociado a la venta' })
  @ManyToOne(() => Service, (service) => service.sales, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'service_id' })
  service?: Service | null;
}
