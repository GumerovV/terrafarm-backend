import { Base } from '../../utils/base'
import { UserEntity } from '../user/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BasketItemEntity } from './basketItem.entity'
import { InfoEntity } from '../info/info.entity'

@Entity('Basket')
export class BasketEntity extends Base {
	@Column({ default: 'ACTIVE' })
	status?: 'ACTIVE' | 'PROCESS' | 'RECEIVED'

	@OneToMany(() => BasketItemEntity, product => product.basket)
	products?: BasketItemEntity[]

	@ManyToOne(() => UserEntity, user => user.basket)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@ManyToOne(() => InfoEntity, info => info.basket, { nullable: true })
	@JoinColumn({ name: 'info_id' })
	info: InfoEntity
}
