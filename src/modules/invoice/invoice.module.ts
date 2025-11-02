import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clientes } from 'src/database/entities/cliente.entity';
import { Faccab } from 'src/database/entities/faccab.entity';
import { Faclin } from 'src/database/entities/faclin.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MAESTROPRODUCTO } from 'src/database';

@Module({
	imports: [TypeOrmModule.forFeature([Clientes, Faccab, Faclin,MAESTROPRODUCTO])],
	controllers: [InvoiceController],
	providers: [InvoiceService],
	exports: [InvoiceService], // Opcional: si necesitas usar el servicio en otros módulos
})
export class InvoiceModule {}
