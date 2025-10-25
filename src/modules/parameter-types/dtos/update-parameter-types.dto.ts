import { PartialType } from '@nestjs/swagger';
import { CreateParameterTypesDto } from './create-parameter-types.dto';

export class UpdateParameterTypesDto extends PartialType(
	CreateParameterTypesDto,
) {}
