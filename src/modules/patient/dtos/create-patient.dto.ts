import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ description: 'Apellido paterno del paciente' })
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Apellido materno del paciente' })
  @IsString()
  @IsOptional()
  motherlastname?: string;

  @ApiProperty({ description: 'Nombre del paciente' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Género del paciente (M/F)' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Tipo de documento (DNI, CE, PASAPORTE, OTROS)' })
  @IsString()
  typedocument: string;

  @ApiProperty({ description: 'Número de documento del paciente' })
  @IsString()
  numdocument: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del paciente',
    example: '1990-05-15',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthdate?: Date;

  @ApiProperty({ description: 'Dirección de residencia' })
  @IsString()
  residence: string;

  @ApiProperty({ description: 'Departamento de residencia' })
  @IsString()
  departament: string;

  @ApiProperty({ description: 'Provincia de residencia' })
  @IsString()
  province: string;

  @ApiProperty({ description: 'Distrito de residencia' })
  @IsString()
  district: string;

  @ApiProperty({ description: 'Número de teléfono', example: '987654321' })
  @IsString()
  @IsOptional()
  numberphone?: string;

  @ApiProperty({ description: 'Seguro del paciente', example: 'Rimac' })
  @IsString()
  insurance: string;

  @ApiProperty({
    description: 'Tipo de paciente (Ambulatorio, Emergencia, Hospitalizado)',
  })
  @IsString()
  typepatient: string;

  @ApiProperty({
    description: 'Número de historia clínica (autogenerado en backend)',
    example: 1234,
  })
  @IsNumber()
  @IsOptional()
  numhistory?: number;

  @ApiProperty({
    description: 'Indica si el paciente está activo (true/false)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isactive?: boolean;

  @ApiProperty({
    description: 'Fecha de registro del paciente',
    example: '2025-10-20T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  registrationdate?: Date;
}
