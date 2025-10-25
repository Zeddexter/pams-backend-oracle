import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AppointmentDto {
  @ApiProperty({ example: '2025-10-22T09:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dateAppointment?: string;

  @ApiProperty({ example: 'PENDIENTE', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateSaleDto {
  @ApiProperty({ example: 'b9a3d9f4-0a8e-46ef-8b7a-0df7a1a77a8f' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: 'e1c8d1e2-1f23-44d1-999b-2a441d1aa22f' })
  @IsUUID()
  specialtyId: string;

  @ApiProperty({ example: 'a3e8d9f4-1111-46ef-8b7a-0df7a1a77a8f' })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: '2d2f5d2a-4e8b-4222-9f11-777a4b2c9f11',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({ example: 120.5, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'A-1001', required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ example: '2025-10-21T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dateAttention?: string;

  @ApiProperty({ example: 'BOLETA', required: false })
  @IsOptional()
  @IsString()
  receiptType?: string;

  @ApiProperty({ example: 'B001-001122', required: false })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'PRESENCIAL', required: false })
  @IsOptional()
  @IsString()
  attentionMode?: string;

  @ApiProperty({ example: 'CONSULTA', required: false })
  @IsOptional()
  @IsString()
  typeAttention?: string;

  @ApiProperty({ type: AppointmentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AppointmentDto)
  appointment?: AppointmentDto;
}
