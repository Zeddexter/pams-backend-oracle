import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/database';
import { DataSource, Repository } from 'typeorm';
import { CreatePatientDto } from './dtos';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { FilterQueryPatientDto } from './dtos/filter-query-patient.dto';
import { BaseService } from 'src/common/services/base-service.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PatientService extends BaseService<Patient> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    public readonly logger: LoggerService,
  ) {
    super(patientRepository, logger);
  }

  // 🔹 Crear paciente (sin .save() → usa insert)
  async create(createDto: CreatePatientDto) {
  try {
    // 📌 Obtener el siguiente número de historia (PostgreSQL)
    const result = await this.dataSource.query(
      `SELECT nextval('public.historiaclinica_seq') AS nextval;`
    );
    const nextNumHistory = result[0].nextval;

    // 📋 Crear el objeto paciente
    const patient = {
      ...createDto,
      numHistory: nextNumHistory,
      registrationDate: new Date(),
    };

    // 🧩 Insertar en la tabla
    const insertResult = await this.patientRepository.insert(patient);
    const newId = insertResult.identifiers?.[0]?.id;

    // 🔍 Retornar el registro insertado
    return await this.patientRepository.findOneBy({ id: newId });
  } catch (error) {
    this.logger.error('Error creating patient', error);

    // ⚠️ Manejo de errores PostgreSQL
    if (error.code === '23505') {
      // 23505 = unique_violation
      throw new InternalServerErrorException(
        'Document number or history number already exists'
      );
    }

    throw new InternalServerErrorException('Error creating patient');
  }
}

  // 🔹 Búsqueda con filtros y paginación
  async findItems(
    filters: FilterQueryPatientDto,
    page = 1,
    limit = 10,
    search = '',
  ) {
    try {
      const { numdocument, numhistory, names } = filters;

      const searchColumns: string[] = [];
      let searchConcatColumns: string[] | undefined;

      if (numdocument) {
        search = numdocument;
        searchColumns.push('numdocument');
      }

      if (numhistory) {
        search = numhistory;
        searchColumns.push('numhistory');
      }

      if (names) {
        search = names;
        searchConcatColumns = ['name', 'lastname', 'motherlastname'];
      }

      return await this.paginate({
        page,
        limit,
        search,
        searchColumns,
        searchConcatColumns,
      });
    } catch (error) {
      this.logger.error('Error finding patients', error);
      throw new InternalServerErrorException('Error finding patients');
    }
  }

  // 🔹 Buscar paciente por ID (sin getOne)
  async findById(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: [
        'doctorSchedule',
        'doctorSchedule.user',
        'doctorSchedule.specialty',
      ],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  // 🔹 Listar pacientes paginados
  async findAll(page = 1, limit = 10, search = '') {
    return await this.paginate({ page, limit, search });
  }

  // 🔹 Actualizar paciente (sin preload / save)
  async update(id: string, updateDto: UpdatePatientDto) {
    try {
      const exists = await this.patientRepository.findOneBy({ id });
      if (!exists) throw new NotFoundException('Patient not found');

      await this.patientRepository.update({ id }, updateDto);

      return await this.patientRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error updating patient', error);
      throw new InternalServerErrorException('Error updating patient');
    }
  }
}
