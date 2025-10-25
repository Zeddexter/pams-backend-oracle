import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubService } from 'src/database';
import { Repository } from 'typeorm';
import { CreateSubserviceDto } from './dtos';

@Injectable()
export class SubserviceService {
	constructor(
		@InjectRepository(SubService)
		private readonly subserviceRepository: Repository<SubService>,
	) {}

	create(createSubserviceDto: CreateSubserviceDto) {
		try {
			const SUBSERVICE = this.subserviceRepository.create(createSubserviceDto);
			return this.subserviceRepository.save(SUBSERVICE);
		} catch (error) {
			console.log(error);
		}
	}

	findAll() {
		return this.subserviceRepository.find();
	}
}
