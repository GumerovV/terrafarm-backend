import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async updateProfile(user: UserEntity, dto: UserDto) {
		user.name = dto.name
		user.surname = dto.surname
		user.country = dto.country
		user.city = dto.city
		user.street = dto.street
		user.building = dto.building
		user.apartment = dto.apartment
		user.number = dto.number

		return await this.userRepository.save(user)
	}
}
