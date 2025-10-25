// faclin.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Faccab } from './faccab.entity';

/**
 * Tabla de facturación
 *
 */
@Entity({ name: 'FACLIN', synchronize: false })
export class Faclin {
	@PrimaryColumn({ name: 'SERIE' })
	serie: string;

	@PrimaryColumn({ name: 'NUMERO' })
	numero: string;

	@PrimaryColumn({ name: 'IDMAESTROPRODUCTO' })
	idmaestroproducto: string;

	@Column({ name: 'DESCRIPCION' })
	descripcion: string;

	@Column({ name: 'CANTIDAD' })
	cantidad: number;

	@Column({ name: 'PRECIO' })
	precio: number;

	@ManyToOne(() => Faccab, (faccab) => faccab.faclin)
	factura: Faccab;
}
