import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from 'src/database/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		UserModule,
		TypeOrmModule.forFeature([User, Role]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule, UserModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get('JWT_SECRET'),
					signOptions: { expiresIn: '2h' },
				};
			},
		}),
	],
	exports: [TypeOrmModule, JwtModule],
})
export class AuthModule {}
