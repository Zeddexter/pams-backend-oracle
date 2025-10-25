import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { CreateSubserviceDto } from './dtos';

@Controller('subservice')
export class SubserviceController {
	constructor(private readonly subserviceService: SubserviceService) {}

	@Post()
	async create(@Body() createSubservice: CreateSubserviceDto) {
		return await this.subserviceService.create(createSubservice);
	}

	@Get()
	async getAll() {
		return this.subserviceService.findAll();
	}
}
