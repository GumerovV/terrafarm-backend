import {
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { Auth, Roles } from '../auth/decorators/auth.decorator'
import { GetAllOrdersDto } from './admin.dto'

@Auth()
@Roles('ADMIN', 'USER')
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get('/orders')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async getAll(@Query() queryDto: GetAllOrdersDto) {
		return this.adminService.getAllOrders(queryDto)
	}

	@Patch('/orders/:id')
	@HttpCode(200)
	async processOrder(@Param('id') orderId: string) {
		return this.adminService.processOrder(+orderId)
	}
}
