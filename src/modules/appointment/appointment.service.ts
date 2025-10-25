import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/database';
import { Repository } from 'typeorm';
import { FiltersAppointmentDto } from './dtos/filters-appointment';
import { UpdateAppointmentDto } from './dtos';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  // ✅ Obtener todas las citas (simple y eficiente)
  async getAllAppointments() {
    return await this.appointmentRepository.find();
  }

  // ✅ Filtrar citas con múltiples condiciones (sin FETCH NEXT)
  async getFilters(filters: FiltersAppointmentDto) {
    const { dateappointment, status, specialtyid, userid, createdat } = filters;

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .addSelect('appointment.createdat')
      .leftJoinAndSelect('appointment.sale', 'sale')
      .leftJoinAndSelect('sale.patient', 'patient')
      .leftJoinAndSelect('sale.specialty', 'specialty')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.service', 'service');

    if (dateappointment) {
      // Oracle DATE comparation: TRUNC(TO_DATE()) evita diferencias de hora
      query.andWhere(
        "TRUNC(appointment.dateappointment) = TRUNC(TO_DATE(:dateappointment, 'YYYY-MM-DD'))",
        { dateappointment },
      );
    }

    if (status) query.andWhere('appointment.status = :status', { status });
    if (specialtyid) query.andWhere('specialty.id = :specialtyid', { specialtyid });
    if (userid) query.andWhere('user.id = :userid', { userid });

    if (createdat) {
      query.andWhere(
        "TRUNC(appointment.createdat) = TRUNC(TO_DATE(:createdat, 'YYYY-MM-DD'))",
        { createdat },
      );
    }

    return await query.getMany();
  }

  // ✅ Obtener cita por ID (sin getOne → usa findOneBy)
  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: [
        'sale',
        'sale.patient',
        'sale.specialty',
        'sale.user',
        'sale.service',
      ],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  // ✅ Crear cita (usa insert() → sin SELECT interno)
  async createAppointment(dto: Partial<Appointment>) {
    const newAppointment = {
      ...dto,
      status: dto.status || 'PENDIENTE',
      dateappointment: dto.dateappointment
        ? new Date(dto.dateappointment).toISOString()
        : null,
    };

    const insertResult = await this.appointmentRepository.insert(newAppointment);
    const newId = insertResult.identifiers?.[0]?.id;

    return await this.appointmentRepository.findOneBy({ id: newId });
  }

  // ✅ Actualizar cita (sin getOne ni save)
  async updateAppointment(id: string, dto: UpdateAppointmentDto) {
    const exists = await this.appointmentRepository.findOneBy({ id });
    if (!exists) {
      throw new NotFoundException('Appointment not found');
    }

    await this.appointmentRepository.update(id, dto);
    return await this.appointmentRepository.findOneBy({ id });
  }
}
