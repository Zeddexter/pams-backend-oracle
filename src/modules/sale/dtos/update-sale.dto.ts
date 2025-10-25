import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { isNumber } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {

}
