import * as bcrypt from 'bcrypt';

interface SeedUser {
	numDocument: string;
	typeDocument: string;
	password: string;
	names: string;
	surnames: string;
	roles: string[];
}

interface Role {
	name: string;
	description: string;
}

interface Permission {
	name: string;
	description: string;
}

interface ParameterType {
	code: string;
}

interface Parameter {
	name: string;
	description: string;
	code: string;
	parameterType: string;
}

interface SeedData {
	users: SeedUser[];
	roles?: Role[];
	permissions?: Permission[];
	parameterTypes?: ParameterType[];
	parameter?: Parameter[];
}

export const initialData: SeedData = {
	roles: [
		{
			name: 'admin',
			description: 'Administrator',
		},
	],
	users: [
		{
			numDocument: '72877083',
			typeDocument: 'DNI',
			password: bcrypt.hashSync('Abc123', 10),
			names: 'Manuel',
			surnames: 'De la Cruz',
			roles: ['1'],
		},
	],
};
