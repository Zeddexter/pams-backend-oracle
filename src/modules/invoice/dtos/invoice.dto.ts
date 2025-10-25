import { IsOptional, IsString, IsIn } from 'class-validator';

export class InvoiceDto {
	@IsOptional()
	@IsString()
	dni?: string;

	@IsOptional()
	@IsString()
	ruc?: string;

	@IsOptional()
	@IsString()
	@IsIn(['1', '2'])
	tipo?: string = '1';
}
