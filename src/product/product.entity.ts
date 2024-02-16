import { Base } from '../../utils/base'
import { Column, Entity } from 'typeorm'

@Entity('Product')
export class ProductEntity extends Base {
	@Column({ nullable: false })
	name: string

	@Column({ nullable: false })
	price: number

	@Column({ nullable: false })
	thumbnailPath: string

	@Column({ type: 'text' })
	description?: string
}
