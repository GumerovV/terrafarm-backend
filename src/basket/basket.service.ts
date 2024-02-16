import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BasketItemEntity } from './basketItem.entity'
import { Repository } from 'typeorm'
import { BasketEntity } from './basket.entity'
import { ProductEntity } from '../product/product.entity'

@Injectable()
export class BasketService {
	constructor(
		@InjectRepository(BasketEntity)
		private readonly basketRepository: Repository<BasketEntity>,
		@InjectRepository(BasketItemEntity)
		private readonly basketItemRepository: Repository<BasketItemEntity>,
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>,
	) {}

	async getBasketId(userId: number) {
		const basket = await this.basketRepository.findOneBy({
			status: 'ACTIVE',
			user: { id: userId },
		})

		if (!basket) {
			throw new NotFoundException('Корзина не найдена!')
		}

		return basket.id
	}

	async getBasket(basketId: number) {
		const basket = await this.basketRepository.findOne({
			where: { id: basketId, status: 'ACTIVE' },
			relations: {
				products: {
					product: true,
				},
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return basket
	}

	async lessCount(basketId: number, id: number) {
		const item = await this.basketItemRepository.findOneBy({
			id,
			basket: { id: basketId },
		})

		if (!item) {
			throw new NotFoundException('Элемент корзины не найден!')
		}

		if (item.count <= 1) return item

		item.count -= 1

		return await this.basketItemRepository.save(item)
	}

	async addCount(basketId: number, id: number) {
		const item = await this.basketItemRepository.findOneBy({
			id,
			basket: { id: basketId },
		})

		if (!item) {
			throw new NotFoundException('Элемент корзины не найден!')
		}

		item.count += 1

		return await this.basketItemRepository.save(item)
	}

	async delete(basketId: number, basketItemId: number) {
		const item = await this.basketItemRepository.findOneBy({
			id: basketItemId,
			basket: { id: basketId },
		})

		if (!item) throw new NotFoundException('Элемент корзины не найден!')

		const deletedItem = await this.basketItemRepository.remove(item)

		return deletedItem
	}

	async create(basketId: number, productId: number) {
		const basket = await this.basketRepository.findOneBy({ id: basketId })

		if (!basket)
			throw new NotFoundException('Что-то пошло не так, попробуйте повторить')

		const product = await this.productRepository.findOneBy({ id: productId })

		if (!product) throw new NotFoundException('Товар не найден!')

		const createdItem = this.basketItemRepository.create({
			basket: basket,
			product: { id: productId },
		})
		const basketItem = await this.basketItemRepository.save(createdItem)

		return basketItem
	}

	async createOrder(userId: number) {
		const basket = await this.basketRepository.findOne({
			where: { user: { id: userId }, status: 'ACTIVE' },
			relations: { products: true },
		})

		if (!basket) throw new NotFoundException('Активная корзина не найдена!')
		if (basket.products.length === 0)
			throw new BadRequestException('Корзина пуста!')

		basket.status = 'PROCESS'
		const order = await this.basketRepository.save(basket)

		const newBasket = this.basketRepository.create({
			user: { id: userId },
		})
		await this.basketRepository.save(newBasket)

		return order
	}

	async getOrders(userId: number) {
		return await this.basketRepository.find({
			where: { user: { id: userId }, status: 'PROCESS' },
			relations: { products: { product: true } },
		})
	}

	async getOrderHistory(userId: number) {
		return await this.basketRepository.find({
			where: { user: { id: userId }, status: 'RECEIVED' },
			relations: { products: { product: true } },
		})
	}
}
