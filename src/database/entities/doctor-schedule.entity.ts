import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Specialty } from './specialty.entity';
import { Patient } from './patients.entity';

@Entity('doctor_schedules')
export class DoctorSchedule extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del horario del doctor (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Título del horario o cita', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string | null;

  @ApiProperty({ description: 'Indica si es un evento de todo el día (true/false)' })
  @Column({ type: 'boolean', default: false })
  allday: boolean;

  @ApiProperty({ description: 'Color del evento', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string | null;

  @ApiProperty({ description: 'Color del texto del evento', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  textColor: string | null;

  @ApiProperty({ description: 'Clase CSS asociada al evento', nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  classname: string | null;

  @ApiProperty({ description: 'URL asociada al evento', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string | null;

  @ApiProperty({ description: 'Inicio del evento (fecha u hora)' })
  @Column({ type: 'timestamp' })
  start: Date;

  @ApiProperty({ description: 'Fin del evento (fecha u hora)', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  end: Date | null;

  // 🔹 Relaciones
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.doctorschedules, {
    onDelete: 'SET NULL',
  })
  user: User;

  @ApiProperty({ type: () => Specialty })
  @ManyToOne(() => Specialty, (specialty) => specialty.doctorschedules, {
    onDelete: 'SET NULL',
  })
  specialty: Specialty;

  @ApiProperty({ type: () => Patient, isArray: true })
  @ManyToMany(() => Patient, (patient) => patient.doctorschedules)
  @JoinTable({
    name: 'doctor_schedule_patients',
    joinColumn: { name: 'doctorscheduleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'patientid', referencedColumnName: 'id' },
  })
  patients?: Patient[];
}
