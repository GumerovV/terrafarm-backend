import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductDto } from './product.dto'
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get('/')
	@HttpCode(200)
	async getAll() {
		return this.productService.getAll()
	}

	@Get('/:id')
	@HttpCode(200)
	async getById(@Param('id') id: string) {
		return this.productService.getById(+id)
	}

	@Post('/')
	@Auth()
	@HttpCode(200)
	async create(@Body() dto: ProductDto) {
		return this.productService.create(dto)
	}
}
