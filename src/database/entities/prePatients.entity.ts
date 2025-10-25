import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from './appointment.entity';

@Entity('pre_patients')
export class PrePatient extends BaseEntityShared {
  @ApiProperty({
    description: 'Identificador único del paciente (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Apellido paterno del paciente',
  })
  @Column({ type: 'varchar', length: 450 })
  lastname: string;

  @ApiProperty({
    description: 'Apellido materno del paciente',
  })
  @Column({ type: 'varchar', length: 450, nullable: true })
  motherlastname: string | null;

  @ApiProperty({
    description: 'Nombre del paciente',
  })
  @Column({ type: 'varchar', length: 450 })
  name: string;

  @ApiProperty({
    description: 'Género del paciente (M/F)',
  })
  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @ApiProperty({
    description: 'Tipo de documento (DNI, CE, PASAPORTE, OTROS)',
    example: 'DNI',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  typedocument: string | null;

  @ApiProperty({
    description: 'Número de documento del paciente',
    example: '12345678',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numdocument: string | null;

  @ApiProperty({
    description: 'Fecha de nacimiento del paciente',
    example: '1990-05-15',
  })
  @Column({ type: 'date', nullable: true })
  birthdate: Date | null;

  @ApiProperty({
    description: 'Fecha de inscripción del paciente',
    example: '2024-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationdate: Date;

  @ApiProperty({
    description: 'Dirección de residencia',
  })
  @Column({ type: 'varchar', length: 900, nullable: true })
  residence: string | null;

  @ApiProperty({
    description: 'Departamento de residencia',
  })
  @Column({ type: 'varchar', length: 100 })
  departament: string;

  @ApiProperty({
    description: 'Provincia de residencia',
  })
  @Column({ type: 'varchar', length: 100 })
  province: string;

  @ApiProperty({
    description: 'Distrito de residencia',
  })
  @Column({ type: 'varchar', length: 100 })
  district: string;

  @ApiProperty({
    description: 'Número de teléfono del paciente',
    example: '987654321',
  })
  @Column({ type: 'varchar', length: 150, nullable: true })
  numberphone: string | null;

  @ApiProperty({
    description: 'Estado del paciente (activo/inactivo)',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  // 🔹 Relación con citas
  @ApiProperty({ type: () => Appointment })
  @OneToOne(() => Appointment, (appointment) => appointment.prepatient, {
    onDelete: 'SET NULL',
  })
  appointment: Appointment;
}
