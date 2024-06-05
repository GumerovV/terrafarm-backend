import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ProductEntity } from './product.entity'
import { NotFoundException } from '@nestjs/common'
import { ProductDto } from './product.dto'

describe('ProductService', () => {
	let service: ProductService
	let repository: Repository<ProductEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					provide: getRepositoryToken(ProductEntity),
					useClass: Repository,
				},
			],
		}).compile()

		service = module.get<ProductService>(ProductService)
		repository = module.get<Repository<ProductEntity>>(
			getRepositoryToken(ProductEntity),
		)
	})

	it('должен быть определен', () => {
		expect(service).toBeDefined()
	})

	describe('getAll', () => {
		it('должен вернуть массив продуктов', async () => {
			const result = [new ProductEntity()]
			jest.spyOn(repository, 'find').mockResolvedValue(result)
			expect(await service.getAll()).toBe(result)
		})
	})

	describe('getById', () => {
		it('должен вернуть один продукт', async () => {
			const id = 1
			const result = new ProductEntity()
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(result)
			expect(await service.getById(id)).toBe(result)
		})

		it('должен выбросить NotFoundException, если продукт не найден', async () => {
			const id = 1
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)
			await expect(service.getById(id)).rejects.toThrow(NotFoundException)
		})
	})

	describe('create', () => {
		it('должен создать и вернуть продукт', async () => {
			const dto: ProductDto = {
				name: 'Тестовый продукт',
				price: 100,
				thumbnailPath: 'test.jpg',
				description: 'Тестовое описание',
			}
			const createdProduct = new ProductEntity()
			jest.spyOn(repository, 'create').mockReturnValue(createdProduct)
			jest.spyOn(repository, 'save').mockResolvedValue(createdProduct)

			expect(await service.create(dto)).toBe(createdProduct)
		})
	})
})
