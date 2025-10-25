import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSpecialityDto } from './create-speciality.dto';

export class UpdateSpecialityDto extends CreateSpecialityDto {
	@ApiProperty()
	id: string;
}
