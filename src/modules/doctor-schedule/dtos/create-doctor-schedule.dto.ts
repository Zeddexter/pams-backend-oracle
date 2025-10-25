import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorScheduleDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	id?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ required: false, default: 0 })
	@IsOptional()
	@IsBoolean()
	allDay?: boolean;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	color?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	textColor?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	className?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	url?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	start: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	end?: string;

	@ApiProperty({ type: String, required: false, description: 'ID del doctor' })
	@IsString()
	@IsOptional()
	user?: string;

	@ApiProperty({
		type: String,
		required: false,
		description: 'ID de la especialidad',
	})
	@IsString()
	@IsOptional()
	specialty?: string;

	@ApiProperty({
  type: Array,
  required: false,
  description: 'Lista de IDs de pacientes',
})
@IsString({ each: true })
@IsOptional()
patients?: string[];
}
