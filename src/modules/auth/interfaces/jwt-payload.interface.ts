import { Roles } from 'src/common/enums/roles.enum';
export interface JwtPayload {
	id: string;
	roles: Roles[];
	specialties: string[];
	names: string;
	lastName: string;
	isActive: boolean;
	motherLastName: string;
	//TODO: añadir todo lo que quieran grabar.
}
