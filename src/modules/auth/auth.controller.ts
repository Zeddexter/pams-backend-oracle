import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	// @Post('login')
	// @ApiOperation({ summary: 'User login' })
	// @ApiCreatedResponse({
	// 	description: 'The record has been successfully created.',
	// })
	// @ApiResponse({ status: 401, description: 'Unauthorized' })
	// async loginUser(@Body() loginUserDto: LoginUserDto) {
	// 	return await this.authService.login(loginUserDto);
	// }

	// @Get('validate-token')
	// @UseGuards(JwtAuthGuard)
	// @ApiBearerAuth()
	// @ApiOperation({ summary: 'Validate JWT token and get user data' })
	// @ApiCreatedResponse({
	// 	description: 'Token is valid, returns user data',
	// })
	// @ApiResponse({ status: 401, description: 'Invalid or expired token' })
	// async validateToken(@Request() req) {
	// 	// El usuario ya está validado por el Guard y está en req.user
	// 	const detailUser = await this.userService.getJwtToken()
	// 	return detailUser;
	// }

// 	@Get('me')
// 	@UseGuards(JwtAuthGuard)
// 	@ApiBearerAuth()
// 	@ApiOperation({ summary: 'Get current user profile' })
// 	async getCurrentUser(@Request() req) {
// 		return await this.authService.getUserProfile(req.user.id);
// 	}
// }
}