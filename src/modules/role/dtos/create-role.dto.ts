import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Nombre del rol', example: 'ADMINISTRADOR' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Rol con acceso total al sistema',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Lista de permisos asociados al rol (UUIDs de permissions)',
    example: ['f3e2a9e0-1234-4bdf-8dcb-b5e3f7c62e80'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
