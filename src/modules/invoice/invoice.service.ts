import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MAESTROPRODUCTO } from 'src/database';
import { Clientes } from 'src/database/entities/cliente.entity';
import { Faccab } from 'src/database/entities/faccab.entity';
import { Faclin } from 'src/database/entities/faclin.entity';
import { InvoiceResult } from 'src/database/entities/invoice-result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
	constructor(
		@InjectRepository(Faccab)
		private readonly faccabRepository: Repository<Faccab>,
		@InjectRepository(Faclin)
		private readonly faclinRepository: Repository<Faclin>,
		@InjectRepository(Clientes)
		private readonly clientesRepository: Repository<Clientes>,
		@InjectRepository(MAESTROPRODUCTO)
		private readonly maestroproductoRepository: Repository<MAESTROPRODUCTO>,
	) {}

	async consultaDNI_RUC(
		DNI: string = '',
		RUC: string = '',
		TIPO: string = '1',
	): Promise<InvoiceResult[]> {
		try {
			const queryBuilder = this.faccabRepository
				.createQueryBuilder('A') // Esto ya define FACCAB como alias 'A'
				.innerJoin(Faclin, 'B', 'A.SERIE = B.SERIE AND A.NUMERO = B.NUMERO')
				.innerJoin(MAESTROPRODUCTO, 'M', 'M.IDMAESTROPRODUCTO = B.IDMAESTROPRODUCTO')
				.innerJoin(
					Clientes,
					'C',
					'C.CODTIENDA = A.CODTIENDA AND C.CODCLIENTE = A.CODCLIENTE',
				)
				.select([
					`C.RUC AS "RUC"`,
					`C.RAZONSOCIAL AS "RAZONSOCIAL"`,
					`C.DNI AS "DNI"`,
					`A.SERIE AS "SERIE"`,
					`A.NUMERO AS "NUMERO"`,
					`A.CODCLIENTE AS "CODCLIENTE"`,
					`B.IDMAESTROPRODUCTO AS "IDMAESTROPRODUCTO"`,
					`M.NOMPRODUCTOMAESTRO AS "DESCRIPCION"`,
					`A.FECHAEMISION AS "FECHAEMISION"`,
					`A.FECHADESPACHO AS "FECHADESPACHO"`,
					`A.FECHAENVIOSUNAT AS "FECHAENVIOSUNAT"`,
					`B.CANTIDAD AS "CANTIDAD"`,
					`B.PRECIO AS "PRECIO"`,
				]);
				// queryBuilder.andWhere(
				// 	`M.IDEXISTENCIA not in ('01')`,
				// 	{ DNI },
				// );
			if (TIPO === '1' && DNI) {
				queryBuilder.andWhere(
					`C.DNI IS NOT NULL AND NVL(TO_CHAR(C.DNI), '') = :DNI`,
					{ DNI },
				);
			} else if (TIPO === '2' && RUC) {
				queryBuilder.andWhere(
					`C.RUC IS NOT NULL AND NVL(TO_CHAR(C.RUC), '') = :RUC`,
					{ RUC },
				);
			} else {
				return [];
			}
queryBuilder.orderBy('A.FECHAEMISION', 'DESC');
			console.log(queryBuilder.getSql());
			return await queryBuilder.getRawMany();
		} catch (error) {
			console.error('Error executing consultaDNI_RUC:', error);
			throw new Error('An error occurred while fetching invoice data.');
		}
	}
}
