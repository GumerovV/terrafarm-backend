import {
	Body,
	Controller,
	Get,
	HttpCode,
	Patch,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../basket/basket.decorator'
import { UserEntity } from './user.entity'
import { UserDto } from './user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@HttpCode(200)
	@Auth()
	async getProfile(@CurrentUser() user: UserEntity) {
		return user
	}

	@Patch()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async updateProfile(@CurrentUser() user: UserEntity, @Body() dto: UserDto) {
		return this.userService.updateProfile(user, dto)
	}
}
