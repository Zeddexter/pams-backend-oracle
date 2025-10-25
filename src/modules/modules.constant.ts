import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { SubmenuModule } from './submenu/submenu.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { ParameterTypesModule } from './parameter-types/parameter-types.module';
import { ParameterModule } from './parameter/parameter.module';
import { PatientModule } from './patient/patient.module';
import { SaleModule } from './sale/sale.module';
import { SpecialityModule } from './speciality/speciality.module';
import { SubserviceModule } from './subservice/subservice.module';
import { ServiceModule } from './service/service.module';
import { ReniecModule } from './reniec/reniec.module';
import { ReportModule } from './reports/report.module';
import { AppointmentModule } from './appointment/appointment.module';
import { InvoicenModule } from './invoice/invoice.module';
import { PrePatientModule } from './prePatient/prePatient.module';
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module';

export const MODULES = [
	AuthModule,
	SeedModule,
	RoleModule,
	MenuModule,
	SubmenuModule,
	UserModule,
	PermissionModule,
	ParameterTypesModule,
	ParameterModule,
	PatientModule,
	PrePatientModule,
	SaleModule,
	SpecialityModule,
	SubserviceModule,
	ServiceModule,
	ReniecModule,
	ReportModule,
	AppointmentModule,
	InvoicenModule,
	DoctorScheduleModule,
];
