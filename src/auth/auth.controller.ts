import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './auth.dto'
import { Auth } from './decorators/auth.decorator'
import { CurrentUser } from '../basket/basket.decorator'
import { UserEntity } from '../user/user.entity'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@Get('/check')
	@HttpCode(200)
	@Auth()
	async check(@CurrentUser() user: UserEntity) {
		return this.authService.check(user)
	}
}
