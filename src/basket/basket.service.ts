import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BasketItemEntity } from './basketItem.entity'
import { In, Repository } from 'typeorm'
import { BasketEntity } from './basket.entity'
import { ProductEntity } from '../product/product.entity'
import { InfoEntity } from '../info/info.entity'
import { InfoDto } from '../info/info.dto'
import { BasketItemDto, NoAuthOrderDto, Product } from './basket.dto'
import { EnumOrderStatus, GetAllOrdersDto } from '../admin/admin.dto'

@Injectable()
export class BasketService {
	constructor(
		@InjectRepository(BasketEntity)
		private readonly basketRepository: Repository<BasketEntity>,
		@InjectRepository(BasketItemEntity)
		private readonly basketItemRepository: Repository<BasketItemEntity>,
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>,
		@InjectRepository(InfoEntity)
		private readonly infoRepository: Repository<InfoEntity>,
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
		const basket = await this.basketRepository
			.createQueryBuilder('basket')
			.leftJoinAndSelect('basket.products', 'products')
			.leftJoinAndSelect('products.product', 'product')
			.where('basket.id = :id', { id: basketId })
			.andWhere('basket.status = :status', { status: 'ACTIVE' })
			.orderBy('products.createdAt', 'DESC')
			.getOne()

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

	async create(basketId: number, productId: number, dto: BasketItemDto) {
		const basket = await this.basketRepository.findOneBy({ id: basketId })

		if (!basket)
			throw new NotFoundException('Что-то пошло не так, попробуйте повторить')

		const product = await this.productRepository.findOneBy({ id: productId })

		if (!product) throw new NotFoundException('Товар не найден!')

		const createdItem = this.basketItemRepository.create({
			basket: basket,
			product: { id: productId },
			color: dto && Object.keys(dto).length ? dto.color : null,
		})
		const basketItem = await this.basketItemRepository.save(createdItem)

		return basketItem
	}

	async createOrder(userId: number, infoDto: InfoDto) {
		const basket = await this.basketRepository.findOne({
			where: { user: { id: userId }, status: 'ACTIVE' },
			relations: { products: true },
		})

		if (!basket) throw new NotFoundException('Активная корзина не найдена!')
		if (basket.products.length === 0)
			throw new BadRequestException('Корзина пуста!')

		const info = this.infoRepository.create({ user: { id: userId } })
		await this.infoRepository.save(info)
		const updatedInfo = await this.updateFields(info, infoDto)

		if (!this.checkInfo(info))
			throw new BadRequestException('Были заполнены не все поля заявки!')

		basket.status = 'PROCESS'
		basket.info = updatedInfo

		const order = await this.basketRepository.save(basket)

		const newBasket = this.basketRepository.create({
			user: { id: userId },
		})
		await this.basketRepository.save(newBasket)

		return order
	}

	async createOrderNoAuth(orderDto: NoAuthOrderDto) {
		await this.productsValidateNoAuth(orderDto.products)

		const newInfo = this.infoRepository.create({ user: null })
		const info = await this.infoRepository.save(newInfo)
		const updatedInfo = await this.updateFields(info, orderDto)

		if (!this.checkInfo(updatedInfo))
			throw new BadRequestException('Были заполнены не все поля заявки!')

		const newBasket = this.basketRepository.create({
			user: null,
			info: updatedInfo,
			status: 'PROCESS',
		})
		const basket = await this.basketRepository.save(newBasket)

		orderDto.products.map(async product => {
			const item = this.basketItemRepository.create({
				basket: basket,
				product: { id: product.id },
				count: product.count,
			})
			await this.basketItemRepository.save(item)
		})

		return basket
	}

	async productsValidateNoAuth(products: Product[]) {
		if (!products.length) throw new BadRequestException('Корзина пуста!')

		for (const product of products) {
			const findProduct = await this.productRepository.findOneBy({
				id: product.id,
			})
			if (!findProduct) throw new NotFoundException('Продукт не найден!')
		}
	}

	async getOrders(userId: number) {
		return await this.basketRepository.find({
			where: { user: { id: userId }, status: 'PROCESS' },
			relations: { products: { product: true }, info: true },
			order: { createdAt: 'DESC' },
		})
	}

	async getOrderHistory(userId: number) {
		return await this.basketRepository.find({
			where: { user: { id: userId }, status: 'RECEIVED' },
			relations: { products: { product: true }, info: true },
			order: { updatedAt: 'DESC' },
		})
	}

	async getAllOrders(userId: number, dto: GetAllOrdersDto) {
		const orders = await this.basketRepository.find({
			where: {
				user: { id: userId },
				status:
					dto?.searchTerm ||
					In([EnumOrderStatus.RECEIVED, EnumOrderStatus.PROCESS]),
			},
			relations: {
				products: {
					product: true,
				},
				info: true,
			},
			order: {
				updatedAt: 'DESC',
			},
		})

		return orders
	}

	async updateFields(info: InfoEntity, dto: InfoDto) {
		info.name = dto.name
		info.surname = dto.surname
		info.country = dto.country
		info.city = dto.city
		info.street = dto.street
		info.building = dto.building
		info.apartment = dto.apartment
		info.number = dto.number

		return await this.infoRepository.save(info)
	}

	checkInfo(info: InfoEntity) {
		if (!info.name) return false
		else if (!info.surname) return false
		else if (!info.country) return false
		else if (!info.city) return false
		else if (!info.street) return false
		else if (!info.building) return false
		else if (!info.apartment) return false
		else if (!info.number) return false

		return true
	}
}
