import { PartialType } from '@nestjs/swagger';
import { CreateSubserviceDto } from './create-subservice.dto';

export class UpdateSubserviceDto extends PartialType(CreateSubserviceDto) {}
