import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Brackets, DataSource, Repository } from 'typeorm';
import { CreatePrePatientDto } from './dtos';
import { UpdatePrePatientDto } from './dtos/update-prePatient.dto';
import { FilterQueryPrePatientDto } from './dtos/filter-query-prePatient.dto';
import { PrePatient } from 'src/database/entities/prePatients.entity';
import { Appointment } from 'src/database';
import { StatusAppointment } from 'src/common/enums/status-appointment.enum';
@Injectable()
export class prePatientService {
	constructor(
		@InjectDataSource() private dataSource: DataSource,
		@InjectRepository(PrePatient)
		private readonly prepatientRepository: Repository<PrePatient>,
		@InjectRepository(Appointment)
		private readonly appointmentRepository: Repository<Appointment>,
	) {}

	async create(createDto: CreatePrePatientDto) {
		try {
			const { appointment, ...rest } = createDto;
			// const result = await this.dataSource.query(`SELECT HISTORIACLINICA_SEQ.NEXTVAL as nextVal FROM DUAL`);
			// const nextNumHistory = result[0].NEXTVAL || result[0].nextval;

			// Crear y guardar la cita (appointment)
			let savedAppointment;
			if (appointment?.dateappointment) {
				const newAppointment = this.appointmentRepository.create({
					...appointment,
					status: StatusAppointment.PENDIENTE, // se guardara por default
					dateappointment: new Date(appointment.dateappointment).toISOString(), // Convertir a string
				});

				// Guardar la cita (appointment) primero
				savedAppointment =
					await this.appointmentRepository.save(newAppointment);
			} else {
				// Si no se proporciona appointment, setear NO_PROGRAMADO
				const newAppointment = this.appointmentRepository.create({
					// sale: null, // o el valor que desees
					status: StatusAppointment.NO_PROGRAMADO,
					dateappointment: '-', // o la fecha que desees
				});
				savedAppointment =
					await this.appointmentRepository.save(newAppointment); // o lanzar un error, etc.
			}

			const patient = this.prepatientRepository.create({
				...createDto,
				appointment: savedAppointment,
				// numHistory: nextNumHistory,
			});

			return await this.prepatientRepository.save(patient);
		} catch (error) {
			console.log(error);

			if (error.code === 'ORA-00001') {
				throw new InternalServerErrorException(
					'Document number or History number already exists',
				);
			}
		}
	}

	async findItems(filters: FilterQueryPrePatientDto) {
		try {
			const { numDocument, names, dateAppointment } = filters;
			const query = this.prepatientRepository
				.createQueryBuilder('PREPATIENT')
				.select('PREPATIENT')
				.leftJoinAndSelect('PREPATIENT.appointment', 'appointment');
			if (!(await query.getCount())) {
				throw new NotFoundException('No patients found');
			}
			if (dateAppointment) {
				query.andWhere('appointment.dateAppointment = :dateAppointment', {
					dateAppointment,
				});
			}
			if (numDocument) {
				query.andWhere('"PREPATIENT"."numDocument" = :numDocument', {
					numDocument,
				});
			}

			if (names) {
				query.andWhere(
					new Brackets((qb) => {
						qb.where('LOWER(PREPATIENT.name) LIKE LOWER(:names)', {
							names: `%${names.toLowerCase()}%`,
						})
							.orWhere('LOWER(PREPATIENT.lastname) LIKE LOWER(:names)', {
								names: `%${names.toLowerCase()}%`,
							})
							.orWhere('LOWER(PREPATIENT.motherLastname) LIKE LOWER(:names)', {
								names: `%${names.toLowerCase()}%`,
							});
					}),
				);
			}

			query.orderBy('"PREPATIENT"."registrationDate"', 'DESC');

			return await query.getMany();
		} catch (error) {
			console.log(error);
		}
	}

	async findAll() {
		return await this.prepatientRepository.find();
	}

	async update(id: string, updateDto: UpdatePrePatientDto) {
		try {
			const patient = await this.prepatientRepository.preload({
				id: id,
				...updateDto,
			});

			if (!patient) {
				throw new NotFoundException('Patient not found');
			}

			return await this.prepatientRepository.save(patient);
		} catch (error) {
			console.log(error);
		}
	}
}
