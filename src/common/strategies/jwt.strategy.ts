import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/modules/auth/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload) {
		return {
			id: payload.id,
			names: payload.names,
			lastName: payload.lastName,
			motherLastName: payload.motherLastName,
			roles: payload.roles,
			isActive: payload.isActive,
			specialties: payload.specialties,
		};
	}
}
