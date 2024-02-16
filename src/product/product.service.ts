import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { Repository } from 'typeorm'
import { ProductDto } from './product.dto'

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>,
	) {}

	//delete
	//update
	//create
	async create(dto: ProductDto) {
		const data = {
			name: dto.name,
			price: dto.price,
			thumbnailPath: dto.thumbnailPath,
			description: dto.description,
		}

		const createdProduct = this.productRepository.create(data)
		const product = await this.productRepository.save(createdProduct)

		return product
	}

	async getById(id: number) {
		const product = await this.productRepository.findOneBy({ id })

		if (!product) throw new NotFoundException('Товар не найден!')

		return product
	}

	async getAll() {
		return this.productRepository.find()
	}
}
