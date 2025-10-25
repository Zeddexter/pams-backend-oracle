import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateDoctorScheduleDto, FilterDoctorScheduleDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorSchedule, Patient, Specialty, User } from 'src/database';
import { Repository } from 'typeorm';
import { UpdateDoctorScheduleDto } from './dtos/update-doctor-schedule.dto';
import { BaseService } from 'src/common/services/base-service.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DoctorScheduleService extends BaseService<DoctorSchedule> {
	constructor(
		@InjectRepository(DoctorSchedule)
		public readonly doctorScheduleRepository: Repository<DoctorSchedule>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Specialty)
		private readonly specialtyRepository: Repository<Specialty>,
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		public readonly logger: LoggerService,
	) {
		super(doctorScheduleRepository, logger);
	}

	

	async create(createDoctorScheduleDto: CreateDoctorScheduleDto) {
  const user = await this.userRepository.findOneBy({ id: createDoctorScheduleDto.user });
  const specialty = await this.specialtyRepository.findOneBy({ id: createDoctorScheduleDto.specialty });

  if (!user || !specialty) throw new Error('Usuario o especialidad no encontrados');

  const fullName = `${user.names} ${user.lastname} ${user.motherlastname}`;

  const doctorSchedule = this.doctorScheduleRepository.create({
    ...createDoctorScheduleDto,
    title: `${specialty.description} - ${fullName}`,
    user,
    specialty,
    patients: [], // ✅ correcto (o puedes omitirlo)
  });

  return await this.doctorScheduleRepository.save(doctorSchedule);
}


	async getFilters(filters: FilterDoctorScheduleDto) {
		try {
			const qb = this.doctorScheduleRepository
  .createQueryBuilder('ds')
  .leftJoinAndSelect('ds.user', 'u')
  .leftJoinAndSelect('ds.specialty', 'sp')
  .leftJoinAndSelect('ds.patients', 'p') // ✅ corregido
  .addSelect([
    'p.id',
    'p.numhistory',
    'p.lastname',
    'p.motherlastname',
    'p.name',
    'p.gender',
    'p.typedocument',
    'p.numdocument',
    'p.birthdate',
    'p.registrationdate',
    'p.residence',
    'p.departament',
    'p.province',
    'p.district',
    'p.numberphone',
    'p.insurance',
    'p.typepatient',
    'p.isactive',
  ]);
qb.andWhere('ds.start >= :start', { start: filters.start });
qb.andWhere('ds.end <= :end', { end: filters.end });

			// // Aplicar filtros solo si están presentes
			// if (filters.start) {
			// 	// Ambos tienen formato: 2025-05-28T05:00:00.000Z
			// 	// Solo comparamos los primeros 10 caracteres (YYYY-MM-DD)
			// 	qb.andWhere('SUBSTR(ds.start, 1, 10) >= SUBSTR(:start, 1, 10)', {
			// 		start: filters.start,
			// 	});
			// }

			// if (filters.end) {
			// 	// Ambos tienen formato: 2025-05-28T05:00:00.000Z
			// 	// Solo comparamos los primeros 10 caracteres (YYYY-MM-DD)
			// 	qb.andWhere('SUBSTR(ds.end, 1, 10) <= SUBSTR(:end, 1, 10)', {
			// 		end: filters.end,
			// 	});
			// }

			if (filters.userId) {
				qb.andWhere('u.id = :userid', { userid: filters.userId });
			}

			if (filters.specialtyId) {
				qb.andWhere('sp.id = :specialtyid', {
					specialtyId: filters.specialtyId,
				});
			}

			qb.orderBy('ds.start', 'ASC');

			return await qb.getMany();
		} catch (error) {
			this.logger.error('Error fetching filtered doctor schedules', error);
			throw error;
		}
	}
async getAll() {
  return await this.doctorScheduleRepository
    .createQueryBuilder('doctor_schedule')
    .leftJoinAndSelect('doctor_schedule.user', 'user')
    .leftJoinAndSelect('doctor_schedule.specialty', 'specialty')
    .leftJoinAndSelect('doctor_schedule.patients', 'patient') // ✅ corregido
    .getMany();
}

async getById(id: string) {
  const doctorSchedule = await this.doctorScheduleRepository
    .createQueryBuilder('doctor_schedule')
    .where('doctor_schedule.id = :id', { id })
    .leftJoinAndSelect('doctor_schedule.user', 'user')
    .leftJoinAndSelect('doctor_schedule.specialty', 'specialty')
    .leftJoinAndSelect('doctor_schedule.patients', 'patient') // ✅ corregido
    .getOne();
	if (!doctorSchedule) {
			throw new Error(`Doctor schedule with id ${id} not found`);
		}

		// Devolver solo el primer usuario y la primera especialidad (si existen)
		return doctorSchedule;
}
	// async getById(id: string) {
	// 	const doctorSchedule = await this.doctorScheduleRepository
	// 		.createQueryBuilder('doctor_schedule')
	// 		.where('doctor_schedule.id = :id', { id })
	// 		.leftJoinAndSelect('doctor_schedule.user', 'user')
	// 		.leftJoinAndSelect('doctor_schedule.specialty', 'specialty')
	// 		.leftJoinAndSelect('doctor_schedule.patient', 'patient')
	// 		.getOne();

	// 	if (!doctorSchedule) {
	// 		throw new Error(`Doctor schedule with id ${id} not found`);
	// 	}

	// 	// Devolver solo el primer usuario y la primera especialidad (si existen)
	// 	return doctorSchedule;
	// }

	async update(id: string, updateDoctorScheduleDto: UpdateDoctorScheduleDto) {
		const doctorSchedule = await this.getById(id);

		if (!doctorSchedule) {
			throw new Error(`Doctor schedule with id ${id} not found`);
		}

		const { ...updateData } = updateDoctorScheduleDto;

		// Actualizar el usuario y la especialidad si se proporcionan
		if (updateDoctorScheduleDto.user) {
			const userSave = await this.userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', { id: updateDoctorScheduleDto.user })
				.getOne();
			doctorSchedule.user = userSave;
		}

		if (updateDoctorScheduleDto.specialty) {
			const specialtySave = await this.specialtyRepository
				.createQueryBuilder('specialty')
				.where('specialty.id = :id', { id: updateDoctorScheduleDto.specialty })
				.getOne();
			doctorSchedule.specialty = specialtySave;
		}

		let title = '';
		if (!updateData.title) {
			const fullName =
				doctorSchedule.user.names +
				' ' +
				doctorSchedule.user.lastname +
				' ' +
				doctorSchedule.user.motherlastname;
			title = doctorSchedule.specialty.description + ' - ' + fullName;
		}

		const save = await this.doctorScheduleRepository.preload({
			id: id,
			...updateData,
			title: title || doctorSchedule.title, // Mantener el título existente si no se proporciona uno nuevo
			user: doctorSchedule.user,
			specialty: doctorSchedule.specialty,
			patients: doctorSchedule.patients,
		});

		return await this.doctorScheduleRepository.save(save);
	}

	async updateAppointment(
		id: string,
		updateDoctorScheduleDto: UpdateDoctorScheduleDto,
	) {
		const doctorSchedule = await this.getById(id);

		if (!doctorSchedule) {
			throw new Error(`Doctor schedule with id ${id} not found`);
		}

		const { ...updateData } = updateDoctorScheduleDto;

		// Actualizar el usuario y la especialidad si se proporcionan
		if (updateDoctorScheduleDto.user) {
			const userSave = await this.userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', { id: updateDoctorScheduleDto.user })
				.getOne();
			doctorSchedule.user = userSave;
		}

		if (updateDoctorScheduleDto.specialty) {
			const specialtySave = await this.specialtyRepository
				.createQueryBuilder('specialty')
				.where('specialty.id = :id', { id: updateDoctorScheduleDto.specialty })
				.getOne();
			doctorSchedule.specialty = specialtySave;
		}

		let patients = [];
		if (
			updateDoctorScheduleDto.patients &&
			updateDoctorScheduleDto.patients.length > 0
		) {
			const patientsBD = await this.patientRepository
				.createQueryBuilder('patients')
				.where('patients.id IN (:...ids)', {
					ids: updateDoctorScheduleDto.patients,
				})
				.getMany();
			patients = patientsBD;
		}

		let title = '';
		if (!updateData.title) {
			const fullName =
				doctorSchedule.user.names +
				' ' +
				doctorSchedule.user.lastname +
				' ' +
				doctorSchedule.user.motherlastname;
			title = doctorSchedule.specialty.description + ' - ' + fullName;
		}

		const save = await this.doctorScheduleRepository.preload({
			id: id,
			...updateData,
			title: title || doctorSchedule.title, // Mantener el título existente si no se proporciona uno nuevo
			user: doctorSchedule.user,
			specialty: doctorSchedule.specialty,
			patients: patients,
		});

		return await this.doctorScheduleRepository.save(save);
	}

	async addPatient(scheduleId: string, patientId: string) {
		console.log('Adding patient to schedule:', patientId);
		const doctorSchedule = await this.getById(scheduleId);
		if (!doctorSchedule) throw new Error('Horario no encontrado');

		const patients = await this.patientRepository
			.createQueryBuilder('patients')
			.where('patients.id = :id', { id: patientId })
			.getMany();
		if (patients.length === 0) throw new Error('Paciente no encontrado');
		const patient = patients[0];
		// if (!patient) throw new Error('Paciente no encontrado');

		// Evita duplicados
		const currentPatients = doctorSchedule.patients || [];
		if (!currentPatients.find((p) => p.id === patientId)) {
			currentPatients.push(patient);
			doctorSchedule.patients = currentPatients;
			await this.doctorScheduleRepository.save(doctorSchedule);
		}
		return doctorSchedule;
	}

	async removePatient(scheduleId: string, patientId: string) {
		const doctorSchedule = await this.getById(scheduleId);
		if (!doctorSchedule) throw new Error('Horario no encontrado');

		doctorSchedule.patients = (doctorSchedule.patients || []).filter(
			(p) => p.id !== patientId,
		);
		await this.doctorScheduleRepository.save(doctorSchedule);
		return doctorSchedule;
	}
}
