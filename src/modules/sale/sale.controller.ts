import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, FiltersSaleDto } from './dtos';

@Controller('sale')
export class SaleController {
	constructor(private readonly saleService: SaleService) {}

	@Post()
	create(@Body() createSale: CreateSaleDto) {
		return this.saleService.createSale(createSale);
	}

	@Get()
	async findAll() {
		return await this.saleService.findAll();
	}

	@Get('filter')
	async findAllFilters(@Query() filters: FiltersSaleDto) {
		const items = await this.saleService.getFilters(filters);
		return {
			message: 'Filtered items fetched successfully',
			items,
		};
	}

@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() dto: Partial<CreateSaleDto>,
	) {
		return await this.saleService.updateSale(id, dto);
	}
  }

