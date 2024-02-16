import { Base } from '../../utils/base'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BasketEntity } from './basket.entity'
import { ProductEntity } from '../product/product.entity'

@Entity('BasketItem')
export class BasketItemEntity extends Base {
	@Column({ default: 1 })
	count?: number

	@ManyToOne(() => ProductEntity, product => product)
	@JoinColumn({ name: 'product_id' })
	product: ProductEntity

	@ManyToOne(() => BasketEntity, basket => basket.products)
	@JoinColumn({ name: 'basket_id' })
	basket: BasketItemEntity
}
