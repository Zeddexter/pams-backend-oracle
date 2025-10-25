import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Sale } from './sale.entity';
import { DoctorSchedule } from './doctor-schedule.entity';

@Entity('patients')
export class Patient extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del paciente (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'Número de la historia clínica del paciente, correlativo en base de datos',
  })
  @Column({ type: 'integer', default: 0 })
  numhistory: number;

  @ApiProperty({ description: 'Apellido paterno del paciente' })
  @Column({ type: 'varchar', length: 450 })
  lastname: string;

  @ApiProperty({ description: 'Apellido materno del paciente' })
  @Column({ type: 'varchar', length: 450, nullable: true })
  motherlastname: string | null;

  @ApiProperty({ description: 'Nombre del paciente' })
  @Column({ type: 'varchar', length: 450 })
  name: string;

  @ApiProperty({ description: 'Género del paciente (M/F)' })
  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @ApiProperty({
    description: 'Tipo de documento (DNI, CE, PASAPORTE, OTROS)',
  })
  @Column({ type: 'varchar', length: 50 })
  typedocument: string;

  @ApiProperty({
    description: 'Número de documento del paciente',
    example: '12345678',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  numdocument: string | null;

  @ApiProperty({
    description: 'Fecha de nacimiento del paciente',
    example: '1990-05-10',
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
    description: 'Dirección de residencia del paciente',
  })
  @Column({ type: 'varchar', length: 900 })
  residence: string;

  @ApiProperty({ description: 'Departamento de residencia' })
  @Column({ type: 'varchar', length: 100 })
  departament: string;

  @ApiProperty({ description: 'Provincia de residencia' })
  @Column({ type: 'varchar', length: 100 })
  province: string;

  @ApiProperty({ description: 'Distrito de residencia' })
  @Column({ type: 'varchar', length: 100 })
  district: string;

  @ApiProperty({ description: 'Número de teléfono del paciente' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  numberphone: string | null;

  @ApiProperty({
    description: 'Seguro médico (Pacifico, Rimac, etc.)',
  })
  @Column({ type: 'varchar', length: 150 })
  insurance: string;

  @ApiProperty({
    description: 'Tipo de paciente (Ambulatorio, Hospitalizado, Emergencia)',
  })
  @Column({ type: 'varchar', length: 50 })
  typepatient: string;

  @ApiProperty({
    description: 'Estado del paciente (activo/inactivo)',
  })
  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  // 🔹 Relación con ventas (Sale)
  @ApiProperty({ type: () => Sale, isArray: true })
  @OneToMany(() => Sale, (sale) => sale.patient)
  sales: Sale[];

  // 🔹 Relación con horario médico
  @ApiProperty({ type: () => DoctorSchedule, isArray: true })
  @ManyToMany(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.patients)
  doctorschedules: DoctorSchedule[];
}
