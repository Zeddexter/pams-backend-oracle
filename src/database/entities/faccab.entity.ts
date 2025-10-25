// faccab.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Clientes } from './cliente.entity';
import { Faclin } from './faclin.entity';

/**
 * Tabla de facturación
 *
 */
@Entity({ name: 'FACCAB', synchronize: false })
export class Faccab {
	@PrimaryColumn({ name: 'SERIE' })
	serie: string;

	@PrimaryColumn({ name: 'NUMERO' })
	numero: string;

	@Column({ name: 'CODCLIENTE' })
	codcliente: string;

	@Column({ name: 'FECHAEMISION' })
	fechaemision: Date;

	@Column({ name: 'FECHADESPACHO' })
	fechadespacho: Date;

	@Column({ name: 'FECHAENVIOSUNAT' })
	fechaenviosunat: Date;

	@ManyToOne(() => Clientes, (cliente) => cliente.facturas)
	cliente: Clientes;

	@OneToMany(() => Faclin, (faclin) => faclin.factura)
	faclin: Faclin[];
}
