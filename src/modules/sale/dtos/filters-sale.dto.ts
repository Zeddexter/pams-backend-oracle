import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class FiltersSaleDto {
  @ApiProperty({ example: '2025-10-21', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'e1c8d1e2-1f23-44d1-999b-2a441d1aa22f', required: false })
  @IsOptional()
  @IsUUID()
  specialityId?: string;

  @ApiProperty({ example: 'a3e8d9f4-1111-46ef-8b7a-0df7a1a77a8f', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'DNI', required: false })
  @IsOptional()
  @IsString()
  typeDocument?: string;

  @ApiProperty({ example: '48502211', required: false })
  @IsOptional()
  @IsString()
  numDocument?: string;

  @ApiProperty({ example: 'López', required: false })
  @IsOptional()
  @IsString()
  names?: string;

  @ApiProperty({ example: 'A-1001', required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ example: 'PENDIENTE', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2025-10-22', required: false })
  @IsOptional()
  @IsDateString()
  dateAppointment?: string;
}
