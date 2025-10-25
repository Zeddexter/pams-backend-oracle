import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/database';
import { Repository } from 'typeorm';
import { parse, format, isValid } from 'date-fns';

@Injectable()
export class ReportService {
	constructor(
		@InjectRepository(Sale)
		private readonly salesRepository: Repository<Sale>,
	) {}

	private parseDate(dateString: string): Date {
		const formats = [
			'yyyy-MM-dd',
			'dd/MM/yyyy',
			'MM/dd/yyyy',
			'yyyyMMdd',
			'yy-MM-dd',
			'dd-MM-yyyy',
		];

		for (const fmt of formats) {
			const parsedDate = parse(dateString, fmt, new Date());
			if (isValid(parsedDate)) return parsedDate;
		}

		throw new Error(`Invalid date format: ${dateString}`);
	}

	async getSalesByDateRange(startDate?: string, endDate?: string) {
		try {
			const qb = this.salesRepository
				.createQueryBuilder('sale')
				.select([
					'sale.id',
					'sale.tipo',
					'sale.serie',
					'sale.numero',
					'sale.price',
					'patient.name',
					'patient.lastname',
					'patient.motherlastname',
					'patient.typedocument',
					'patient.numdocument',
					'patient.registrationdate',
					'patient.departament',
					'patient.province',
					'patient.district',
					'patient.gender',
					'patient.birthdate',
					'specialty.description AS desc_specialty',
					'service.description AS desc_service',
					'subservice.description AS desc_subservice',
				])
				.innerJoin('sale.specialty', 'specialty')
				.leftJoin('sale.service', 'service')
				.leftJoin('service.subservice', 'subservice')
				.innerJoin('sale.patient', 'patient');

			// 🔹 Filtrado por rango de fechas
			if (startDate && endDate) {
				const start = format(this.parseDate(startDate), 'yyyy-MM-dd');
				const end = format(this.parseDate(endDate), 'yyyy-MM-dd');
				qb.andWhere('DATE(sale.createdat) BETWEEN :start AND :end', { start, end });
			} else if (startDate) {
				const start = format(this.parseDate(startDate), 'yyyy-MM-dd');
				qb.andWhere('DATE(sale.createdat) >= :start', { start });
			} else if (endDate) {
				const end = format(this.parseDate(endDate), 'yyyy-MM-dd');
				qb.andWhere('DATE(sale.createdat) <= :end', { end });
			}

			qb.orderBy('sale.createdat', 'DESC');

			return await qb.getRawMany();
		} catch (error) {
			console.error('Error fetching sales by date range:', error);
			throw new InternalServerErrorException(
				`Error fetching sales by date range: ${error.message}`,
			);
		}
	}
}
