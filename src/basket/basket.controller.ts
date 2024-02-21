import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { BasketService } from './basket.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from './basket.decorator'
import { InfoDto } from '../info/info.dto'
import { BasketItemDto, NoAuthOrderDto } from './basket.dto'

@Controller('basket')
export class BasketController {
	constructor(private readonly basketService: BasketService) {}

	@Get('/')
	@HttpCode(200)
	@Auth()
	async getBasket(@CurrentUser('id') userId: number) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.getBasket(basketId)
	}

	@Post('/addToBasket/:productId')
	@HttpCode(200)
	@Auth()
	async addBasketItem(
		@CurrentUser('id') userId: number,
		@Param('productId') productId: string,
		@Body() dto: BasketItemDto,
	) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.create(basketId, +productId, dto)
	}

	@Delete('/deleteFromBasket/:basketItemId')
	@HttpCode(200)
	@Auth()
	async deleteBasketItem(
		@CurrentUser('id') userId: number,
		@Param('basketItemId') basketItemId: string,
	) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.delete(basketId, +basketItemId)
	}

	@Patch('/addCountItem/:basketItemId')
	@HttpCode(200)
	@Auth()
	async addCountItem(
		@CurrentUser('id') userId: number,
		@Param('basketItemId') basketItemId: string,
	) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.addCount(basketId, +basketItemId)
	}

	@Patch('/lessCountItem/:basketItemId')
	@HttpCode(200)
	@Auth()
	async lessCountItem(
		@CurrentUser('id') userId: number,
		@Param('basketItemId') basketItemId: string,
	) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.lessCount(basketId, +basketItemId)
	}

	@Post('/createOrder')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	async createOrder(
		@CurrentUser('id') userId: number,
		@Body() infoDto: InfoDto,
	) {
		return this.basketService.createOrder(userId, infoDto)
	}

	@Post('/no-auth/createOrder')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async NoAuthCreateOrder(@Body() orderDto: NoAuthOrderDto) {
		return this.basketService.createOrderNoAuth(orderDto)
	}

	@Get('/getOrders')
	@HttpCode(200)
	@Auth()
	async getOrders(@CurrentUser('id') userId: number) {
		return this.basketService.getOrders(userId)
	}

	@Get('/getOrdersHistory')
	@HttpCode(200)
	@Auth()
	async getOrdersHistory(@CurrentUser('id') userId: number) {
		return this.basketService.getOrderHistory(userId)
	}
}
