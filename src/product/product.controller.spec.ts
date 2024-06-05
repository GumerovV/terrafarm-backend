import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductDto } from './product.dto'
import { NotFoundException } from '@nestjs/common'
import { ProductEntity } from './product.entity'

describe('ProductController', () => {
	let controller: ProductController
	let service: ProductService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductController],
			providers: [
				{
					provide: ProductService,
					useValue: {
						getAll: jest.fn(),
						getById: jest.fn(),
						create: jest.fn(),
					},
				},
			],
		}).compile()

		controller = module.get<ProductController>(ProductController)
		service = module.get<ProductService>(ProductService)
	})

	it('должен быть определен', () => {
		expect(controller).toBeDefined()
	})

	describe('getAll', () => {
		it('должен вернуть массив продуктов', async () => {
			const result: ProductEntity[] = [new ProductEntity()]
			jest.spyOn(service, 'getAll').mockResolvedValue(result)
			expect(await controller.getAll()).toBe(result)
		})
	})

	describe('getById', () => {
		it('должен вернуть один продукт', async () => {
			const id = '1'
			const result = new ProductEntity()
			jest.spyOn(service, 'getById').mockResolvedValue(result)
			expect(await controller.getById(id)).toBe(result)
		})

		it('должен выбросить NotFoundException, если продукт не найден', async () => {
			const id = '1'
			jest.spyOn(service, 'getById').mockRejectedValue(new NotFoundException())
			await expect(controller.getById(id)).rejects.toThrow(NotFoundException)
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
			const result = new ProductEntity()
			jest.spyOn(service, 'create').mockResolvedValue(result)
			expect(await controller.create(dto)).toBe(result)
		})
	})
})
