import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { UpdateAppointmentDto } from './dtos';
import { FiltersAppointmentDto } from './dtos/filters-appointment';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAppointment() {
    return await this.appointmentService.getAllAppointments();
  }

  @Get('filter')
  async findAllFilters(@Query() filters: FiltersAppointmentDto) {
    const items = await this.appointmentService.getFilters(filters);
    return {
      message: 'Filtered items fetched successfully',
      items,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentService.getAppointmentById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }
}
