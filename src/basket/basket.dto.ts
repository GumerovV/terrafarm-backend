import { InfoDto } from '../info/info.dto'
import { IsArray, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class Product {
	@IsNumber()
	id: number

	@IsNumber()
	count: number
}

export class NoAuthOrderDto extends InfoDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Product)
	products: Product[]
}
