import {
	IsNotEmpty,
	IsObject,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReniecDto {
	@ApiProperty({ example: '12345678', description: 'DNI del ciudadano' })
	@IsString()
	@IsNotEmpty()
	dni: string;
	@ApiProperty({ example: 'JOSE JOEL', description: 'Nombres del ciudadano' })
	@IsString()
	@IsNotEmpty()
	nombres: string;
	@ApiProperty({ example: 'TORRES', description: 'Apellido paterno' })
	@IsString()
	@IsNotEmpty()
	apellido_paterno: string;
	@ApiProperty({ example: 'DE LA CRUZ', description: 'Apellido materno' })
	@IsString()
	@IsNotEmpty()
	apellido_materno: string;
}

export class ReniecDto {
	respuesta: string;
	data: {
		dni: string;
		nombres: string;
		apellido_paterno: string;
		apellido_materno: string;
		fecha_nacimiento: string;
		sexo: string;
	};
	codigo: number;
}

export class ReniecDniRequestDataDto {
	@ApiProperty({ example: 'JOSE JOEL', description: 'Nombres del ciudadano' })
	@IsString()
	@IsNotEmpty()
	nombres: string;

	@ApiProperty({ example: 'TORRES', description: 'Apellido paterno' })
	@IsString()
	@IsNotEmpty()
	apellido_paterno: string;

	@ApiProperty({ example: 'DE LA CRUZ', description: 'Apellido materno' })
	@IsString()
	@IsNotEmpty()
	apellido_materno: string;
}
export class ReniecDniRequestDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ReniecDniRequestDataDto)
	data: ReniecDniRequestDataDto;
}

export class ReniecNamesResponseDto {
	respuesta: string;
	data: {
		dni: string;
		nombres: string;
		apellido_paterno: string;
		apellido_materno: string;
	};
	codigo: number;
}
