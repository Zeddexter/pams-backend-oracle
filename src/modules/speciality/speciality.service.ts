import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialityDto } from './dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from 'src/database';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialityRepository: Repository<Specialty>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  // 🔹 Crear especialidad (sin .save() con SELECT interno)
 async create(dto: CreateSpecialityDto) {
  try {
    const entity = {
      ...dto,
      // ✅ convertir explícitamente a boolean y eliminar el tipo number
      isactive: Boolean(dto.isactive ?? true),
    };

    const result = await this.specialityRepository.insert(entity);
    const newId = result.identifiers?.[0]?.id;

    return await this.specialityRepository.findOneBy({ id: newId });
  } catch (error) {
    this.logger.error('Error creating speciality', error);
    throw error;
  }
}

  // 🔹 Actualizar especialidad (sin preload ni save)
  async update(id: string, dto: CreateSpecialityDto) {
    try {
      const exists = await this.specialityRepository.findOneBy({ id });
      if (!exists) throw new NotFoundException('Specialty not found');

      await this.specialityRepository.update({ id }, dto);

      return await this.specialityRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error updating speciality', error);
      throw error;
    }
  }

  // 🔹 Listar todas las especialidades
  findAll() {
    return this.specialityRepository.find();
  }

  // 🔹 Eliminar especialidad
  async deleteSpecialty(id: string) {
    try {
      // Verificar si tiene usuarios asociados
      const hasUsers = await this.specialityRepository
        .createQueryBuilder('s')
        .innerJoin('s.users', 'u')
        .where('s.id = :id', { id })
        .getExists(); // ✅ no genera FETCH NEXT

      if (hasUsers) {
        throw new NotFoundException(
          'No puedes eliminar una especialidad que tiene usuarios asociados',
        );
      }

      const specialty = await this.specialityRepository.findOneBy({ id });
      if (!specialty) throw new NotFoundException('Specialty not found');

      await this.specialityRepository.delete({ id });
      return { message: 'Specialty deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting speciality', error);
      throw error;
    }
  }

  // 🔹 Buscar especialidad + usuarios (solo si necesario)
  async specialityXUsers(id: string) {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      return speciality;
    } catch (error) {
      this.logger.error('Error finding speciality by users', error);
      throw error;
    }
  }

  // 🔹 Buscar especialidad por ID (sin FETCH NEXT)
  async speciality(id: string) {
    try {
      return await this.specialityRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error finding speciality', error);
      throw error;
    }
  }
}
