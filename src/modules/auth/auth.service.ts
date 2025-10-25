import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { ErrorCode } from 'src/common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomException } from 'src/common/models';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly dataSource: DataSource,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) {}
	
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

}
