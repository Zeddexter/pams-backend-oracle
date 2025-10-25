import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service, SubService } from 'src/database';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';

@Injectable()
export class ServiceService {
	constructor(
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
		@InjectRepository(SubService)
		private readonly subserviceRepository: Repository<SubService>,
	) {}

	async create(dto: CreateServiceDto) {
		try {
			const { subserviceId, ...serviceData } = dto;

			const subservice = await this.subserviceRepository
				.createQueryBuilder('SUBSERVICE')
				.where('SUBSERVICE.id = :id', { id: subserviceId })
				.getOne();

			if (!subservice) {
				throw new Error('Subservice not found');
			}

			const service = this.serviceRepository.create({
				...serviceData,
				subservice: subservice,
			});

			return await this.serviceRepository.save(service);
		} catch (error) {
			console.log(error);
		}
	}

	async findAll() {
		return await this.serviceRepository.find({
			relations: ['subService'],
		});
	}
}
