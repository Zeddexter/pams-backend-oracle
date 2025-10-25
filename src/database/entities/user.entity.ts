import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { BaseEntityShared } from 'src/common/models';
import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from './specialty.entity';
import { Sale } from './sale.entity';
import { DoctorSchedule } from './doctor-schedule.entity';

@Entity('users')
export class User extends BaseEntityShared {
  @ApiProperty({ description: 'Identificador único del usuario (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Número de documento del usuario' })
  @Column({ type: 'varchar', unique: true, name: 'numdocument', length: 50 })
  numdocument: string;

  @ApiProperty({ example: 'DNI', description: 'Tipo de documento del usuario' })
  @Column({ type: 'varchar', length: 10, name: 'typedocument' })
  typedocument: string;

  @ApiProperty({ description: 'Contraseña encriptada del usuario' })
  @Column({ type: 'varchar', select: false, name: 'password' })
  password: string;

  @ApiProperty({ description: 'Indica si el usuario está activo' })
  @Column({ type: 'boolean', default: true, name: 'isactive' })
  isactive: boolean;

  @ApiProperty({ description: 'Nombres del usuario' })
  @Column({ type: 'varchar', length: 350, name: 'names' })
  @MinLength(1)
  names: string;

  @ApiProperty({ description: 'Apellido paterno del usuario' })
  @Column({ type: 'varchar', length: 350, name: 'lastname' })
  @MinLength(1)
  lastname: string;

  @ApiProperty({ description: 'Apellido materno del usuario' })
  @Column({ type: 'varchar', length: 350, name: 'motherlastname' })
  @MinLength(1)
  motherlastname: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  @Column({ type: 'varchar', nullable: true, length: 550, name: 'fullname' })
  fullname: string;

  // 🔹 Relaciones con roles
  @ApiProperty({ type: () => Role, isArray: true })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'userid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleid', referencedColumnName: 'id' },
  })
  roles: Role[];

  // 🔹 Relaciones con especialidades
  @ApiProperty({ type: () => Specialty, isArray: true })
  @ManyToMany(() => Specialty, (specialty) => specialty.users)
  @JoinTable({
    name: 'users_specialties', // ✅ nombre correcto y consistente
    joinColumn: { name: 'userid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specialtyid', referencedColumnName: 'id' },
  })
  specialties: Specialty[];

  // 🔹 Ventas asociadas
  @ApiProperty({ type: () => Sale, isArray: true })
  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  // 🔹 Horarios del doctor
  @ApiProperty({ type: () => DoctorSchedule, isArray: true })
  @OneToMany(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.user)
  doctorschedules: DoctorSchedule[];
}
