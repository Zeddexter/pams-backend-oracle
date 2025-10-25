import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dtos/create-service.dto';

@Controller('service')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Post()
	async create(@Body() createService: CreateServiceDto) {
		return await this.serviceService.create(createService);
	}

	@Get()
	async getAll() {
		return this.serviceService.findAll();
	}
}
