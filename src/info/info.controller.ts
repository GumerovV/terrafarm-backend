import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { InfoService } from './info.service'
import { Auth, Roles } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../basket/basket.decorator'
import { InfoDto } from './info.dto'

@Controller('info')
export class InfoController {
	constructor(private readonly infoService: InfoService) {}

	@Get()
	@HttpCode(200)
	@Auth()
	async get(@CurrentUser('id') userId: number) {
		return this.infoService.get(userId)
	}

	@Put()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async update(@CurrentUser('id') userId: number, @Body() dto: InfoDto) {
		return this.infoService.update(userId, dto)
	}

	@Get('/admin')
	@HttpCode(200)
	@Auth()
	@Roles('ADMIN')
	async adminRoute() {
		return { message: 'Hello Admin!' }
	}
}
