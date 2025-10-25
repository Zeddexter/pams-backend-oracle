import { PartialType } from '@nestjs/swagger';
import { CreatePrePatientDto } from './create-prePatient.dto';

export class UpdatePrePatientDto extends PartialType(CreatePrePatientDto) {}
