import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BasketEntity } from '../basket/basket.entity'
import { In, Repository } from 'typeorm'
import { EnumOrderStatus, GetAllOrdersDto } from './admin.dto'

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(BasketEntity)
		private readonly basketRepository: Repository<BasketEntity>,
	) {}

	async getAllOrders(dto: GetAllOrdersDto) {
		let searchTerm = dto.searchTerm

		if (!searchTerm) searchTerm = EnumOrderStatus.PROCESS

		const orders = await this.basketRepository.find({
			where: {
				status:
					dto?.searchTerm ||
					In([EnumOrderStatus.RECEIVED, EnumOrderStatus.PROCESS]),
			},
			relations: { products: { product: true }, info: true },
			order: {
				updatedAt: 'DESC',
			},
		})

		return orders
	}

	async processOrder(orderId: number) {
		const order = await this.basketRepository.findOneBy({ id: orderId })

		if (!order || order.status !== 'PROCESS')
			throw new BadRequestException('Что-то пошло не так, поробуйте повторить!')

		order.status = 'RECEIVED'

		return await this.basketRepository.save(order)
	}
}
