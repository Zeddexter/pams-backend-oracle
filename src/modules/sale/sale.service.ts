import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Appointment,
  Patient,
  Sale,
  Service,
  Specialty,
  User,
} from 'src/database';
import { Repository } from 'typeorm';
import { CreateSaleDto, FiltersSaleDto } from './dtos';
import { StatusAppointment } from 'src/common/enums/status-appointment.enum';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}


  // 🔹 CREATE SALE
  async createSale(dto: CreateSaleDto) {
    try {
      const {
        patientId,
        specialtyId,
        userId,
        serviceId,
        appointment,
        ...rest
      } = dto;

      // 🔸 Validar relaciones requeridas
      const patient = await this.patientRepository.findOneBy({ id: patientId });
      if (!patient) throw new NotFoundException('Patient not found');

      const specialty = await this.specialtyRepository.findOneBy({ id: specialtyId });
      if (!specialty) throw new NotFoundException('Specialty not found');

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      let service: Service | null = null;
      if (serviceId) {
        service = await this.serviceRepository.findOneBy({ id: serviceId });
        if (!service) throw new NotFoundException('Service not found');
      }

      // 🔸 Crear cita asociada (si viene en DTO)
      let appointmentEntity: Appointment | null = null;
      if (appointment?.dateAppointment) {
        appointmentEntity = this.appointmentRepository.create({
          ...appointment,
          status: appointment.status || StatusAppointment.PENDIENTE,
          dateappointment: new Date(appointment.dateAppointment),
        });
        appointmentEntity = await this.appointmentRepository.save(appointmentEntity);
      }

      // 🔸 Crear venta
      const sale = this.saleRepository.create({
        ...rest,
        price: rest.price ?? 0,
        patient,
        specialty,
        user,
        service,
        appointment: appointmentEntity,
      });

      return await this.saleRepository.save(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error(error.message || 'Error creating sale');
    }
  }

  // 🔹 FIND ALL SALES
  async findAll() {
    return await this.saleRepository.find({
      relations: ['patient', 'service', 'specialty', 'appointment', 'user'],
      order: { createdat: 'DESC' },
    });
  }

  // 🔹 FILTROS (PostgreSQL)
  async getFilters(filters: FiltersSaleDto) {
    const {
      date,
      specialityId,
      userId,
      typeDocument,
      numDocument,
      names,
      serialNumber,
      status,
      dateAppointment,
    } = filters;

    const query = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.patient', 'patient')
      .leftJoinAndSelect('sale.service', 'service')
      .leftJoinAndSelect('sale.specialty', 'specialty')
      .leftJoinAndSelect('sale.appointment', 'appointment')
      .leftJoinAndSelect('sale.user', 'user');

    // 🔸 Filtro por fecha
    if (date) {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      query.andWhere('DATE(sale.createdAt) = :date', { date: formattedDate });
    }

    if (specialityId)
      query.andWhere('specialty.id = :specialityId', { specialityId });

    if (userId)
      query.andWhere('user.id = :userId', { userId });

    if (typeDocument)
      query.andWhere('patient.typedocument = :typeDocument', { typeDocument });

    if (numDocument)
      query.andWhere('patient.numdocument = :numDocument', { numDocument });

    if (serialNumber)
      query.andWhere('sale.serie = :serialNumber', { serialNumber });

    if (status)
      query.andWhere('appointment.status = :status', { status });

    if (dateAppointment)
      query.andWhere('DATE(appointment.dateappointment) = :dateAppointment', {
        dateAppointment,
      });

    if (names) {
      query.andWhere(
        `(LOWER(patient.name) LIKE LOWER(:names)
          OR LOWER(patient.lastName) LIKE LOWER(:names)
          OR LOWER(patient.motherLastName) LIKE LOWER(:names))`,
        { names: `%${names}%` },
      );
    }

    query.orderBy('sale.createdat', 'DESC');
    return await query.getMany();
  }

  // 🔹 UPDATE SALE
  async updateSale(id: string, dto: Partial<CreateSaleDto>) {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['appointment', 'patient', 'specialty', 'user', 'service'],
    });

    if (!sale) throw new NotFoundException('Sale not found');

    const {
      patientId,
      specialtyId,
      userId,
      serviceId,
      appointment,
      ...rest
    } = dto;

    // 🔸 Actualizar relaciones
    if (patientId) {
      const patient = await this.patientRepository.findOneBy({ id: patientId });
      if (patient) sale.patient = patient;
    }

    if (specialtyId) {
      const specialty = await this.specialtyRepository.findOneBy({ id: specialtyId });
      if (specialty) sale.specialty = specialty;
    }

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (user) sale.user = user;
    }

    if (serviceId) {
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      if (service) sale.service = service;
    }

    // 🔸 Actualizar cita
    if (appointment) {
      if (sale.appointment) {
        sale.appointment.status =
          appointment.status || sale.appointment.status;
        sale.appointment.dateappointment = appointment.dateAppointment
          ? new Date(appointment.dateAppointment)
          : sale.appointment.dateappointment;
        await this.appointmentRepository.save(sale.appointment);
      } else {
        const newAppointment = this.appointmentRepository.create({
          status: appointment.status || StatusAppointment.PENDIENTE,
          dateappointment: appointment.dateAppointment
            ? new Date(appointment.dateAppointment)
            : new Date(),
        });
        sale.appointment = await this.appointmentRepository.save(newAppointment);
      }
    }

    Object.assign(sale, rest);
    return await this.saleRepository.save(sale);
  }
}
