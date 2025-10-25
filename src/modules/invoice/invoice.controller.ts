import { Controller, Get, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from './dtos/invoice.dto';

@ApiTags('Invoice')
@Controller('Invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@Get('consulta')
	@ApiQuery({ name: 'dni', required: false, type: String })
	@ApiQuery({ name: 'ruc', required: false, type: String })
	@ApiQuery({ name: 'tipo', required: false, enum: ['1', '2'] })
	@ApiResponse({ status: 200, description: 'Consulta realizada con éxito' })
	async consulta(@Query() params: InvoiceDto) {
		const result = await this.invoiceService.consultaDNI_RUC(
			params.dni,
			params.ruc,
			params.tipo,
		);
		return result;
	}
}
