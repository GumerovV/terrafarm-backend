import { Base } from '../../utils/base'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { BasketEntity } from '../basket/basket.entity'

@Entity('Info')
export class InfoEntity extends Base {
	@Column({ default: '' })
	name?: string

	@Column({ default: '' })
	surname?: string

	@Column({ default: '' })
	country?: string

	@Column({ default: '' })
	city?: string

	@Column({ default: '' })
	street?: string

	@Column({ default: '' })
	building?: string

	@Column({ default: '' })
	apartment?: string

	@Column({ default: '' })
	number?: string

	@OneToOne(() => UserEntity, user => user.info, { nullable: true })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@OneToOne(() => BasketEntity, basket => basket.info)
	@JoinColumn({ name: 'basket_id' })
	basket: BasketEntity
}
