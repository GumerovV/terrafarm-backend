import { Column, Entity, OneToMany } from 'typeorm'
import { Base } from '../../utils/base'
import { BasketEntity } from '../basket/basket.entity'
import { InfoEntity } from '../info/info.entity'

@Entity('User')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: '' })
	name?: string

	@Column({ default: '' })
	surname?: string

	@Column({ default: '' })
	number?: string

	@Column({ default: 'USER' })
	role?: 'USER' | 'ADMIN'

	@OneToMany(() => BasketEntity, basket => basket.user)
	basket: BasketEntity[]

	@OneToMany(() => InfoEntity, info => info.user)
	info: InfoEntity[]
}
