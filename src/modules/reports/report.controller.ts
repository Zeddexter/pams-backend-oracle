import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Permission, Sale } from 'src/database';
import { ReportService } from './report.service';

@ApiTags('Report')
@Controller('report')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}
	@Get(':startdate/:enddate')
	@ApiOperation({ summary: 'Get report sales' })
	@ApiResponse({ status: 200, description: 'report found', type: Sale })
	@ApiNotFoundResponse({ description: 'Sales not found' })
	getSalesByDateRange(
		@Param('startdate') startdate: string,
		@Param('enddate') enddate: string,
	) {
		console.log(startdate, enddate);
		return this.reportService.getSalesByDateRange(startdate, enddate);
	}
}
