import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Faccab } from './faccab.entity';

@Entity({ name: 'CLIENTES',  synchronize: false })
export class Clientes {
	@PrimaryColumn({ name: 'CODCLIENTE' })
	codcliente: string;

	@Column({ name: 'RUC' })
	ruc: string;

	@Column({ name: 'RAZONSOCIAL' })
	razonsocial: string;

	@Column({ name: 'DNI' })
	dni: string;

	@OneToMany(() => Faccab, (faccab) => faccab.cliente)
	facturas: Faccab[];
}
