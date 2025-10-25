import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/database';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos';
import { JwtPayload } from './interfaces';
import { ErrorCode } from 'src/common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomException } from 'src/common/models';
import { UserService } from '../user/user.service';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		private readonly jwtService: JwtService,
		private readonly dataSource: DataSource,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
		private readonly userService: UserService,
	) {}
	async login(loginUserDto: LoginUserDto) {
		try {
			const { password, numdocument } = loginUserDto;

			// const user = await this.userRepository
			// 	.createQueryBuilder('user')
			// 	.where('user.numDocument = :numDocument', { numDocument })
			// 	.select([
			// 		'user.password',
			// 	])
			// 	.getOne();

			const user = await this.userRepository
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.roles', 'roles')
				.leftJoinAndSelect('user.specialties', 'specialties') // <-- Cambiar aquí también
				.where('user.numdocument = :numdocument', { numdocument })
				.select([
					'user.id',
					'user.numdocument',
					'user.names',
					'user.lastname',
					'user.motherlastname',
					'user.password',
					'user.isactive',
					'roles.id',
					'roles.name',
					'specialties.id',
					'specialties.description', // Si tienes este campo
				])
				.getOne();

			if (!user) {
				throw new CustomException(
					'Usuario no existe',
					ErrorCode.ERROR_USER_NOT_FOUND,
				);
			}

			if (user.isactive === false) {
				throw new CustomException(
					'Usuario inactivo',
					ErrorCode.ERROR_USER_INACTIVE,
				);
			}

			if (!bcrypt.compareSync(password, user.password)) {
				throw new CustomException(
					'Credenciales incorrectas',
					ErrorCode.ERROR_CREDENTIALS_INCORRECTS,
				);
			}

			delete user.password;

			this.logger.log(user, 'AuthService - User found');

			const { id, roles } = user;

			return {
				id,
				roles,
				token: this.getJwtToken({
					id: user.id,
					names: user.names,
					lastName: user.lastname,
					motherLastName: user.motherlastname,
					isActive: user.isactive,
					roles: user.roles.map((role) => role.name as Roles),
					specialties: user?.specialties?.map(
						(speciality) => speciality.description,
					),
				}),
			};
		} catch (error) {
			throw error;
		}
	}

	private getJwtToken(payload: JwtPayload) {
		const token = this.jwtService.sign(payload);
		return token;
	}

	private handleDBError(error: any): never {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}
		console.error(error);
		throw new InternalServerErrorException('Please check server logs');
	}

	async getUserProfile(userId: string) {
		try {
			const user = await this.userRepository
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.roles', 'roles')
				.leftJoinAndSelect('user.specialities', 'specialities')
				.where('user.id = :id', { id: userId })
				.select([
					'user.id',
					'user.numdocument',
					'user.typedocument',
					'user.names',
					'user.lastname',
					'user.motherlastname',
					'user.fullname',
					'roles.id',
					'roles.name',
					'specialities.id',
					'specialities.description',
				])
				.getOne();

			if (!user) {
				throw new CustomException(
					'Usuario no encontrado',
					ErrorCode.ERROR_USER_NOT_FOUND,
				);
			}

			return user;
		} catch (error) {
			this.logger.error(
				`Error getting user profile: ${error.message}`,
				error.stack,
				'AuthService',
			);
			throw error;
		}
	}
}
