import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntityShared } from 'src/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Sale } from './sale.entity';
import { DoctorSchedule } from './doctor-schedule.entity';

@Entity('specialties')
export class Specialty extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único de la especialidad (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 450 })
  description: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isactive: boolean;

    // 🔹 Relación ManyToMany con usuarios (CORREGIDA)
  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User, (user) => user.specialties)
  users: User[];

  // 🔹 Relación OneToMany con ventas
  @ApiProperty({ type: () => Sale, isArray: true })
  @OneToMany(() => Sale, (sale) => sale.specialty)
  sales: Sale[];

  // 🔹 Relación OneToMany con horarios de doctores
  @ApiProperty({ type: () => DoctorSchedule, isArray: true })
  @OneToMany(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.specialty)
  doctorschedules: DoctorSchedule[];
}
