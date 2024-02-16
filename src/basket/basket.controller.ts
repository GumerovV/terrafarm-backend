import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { BasketService } from './basket.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from './basket.decorator'

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
	) {
		const basketId = await this.basketService.getBasketId(userId)
		return this.basketService.create(basketId, +productId)
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
	@HttpCode(200)
	@Auth()
	async createOrder(@CurrentUser('id') userId: number) {
		return this.basketService.createOrder(userId)
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