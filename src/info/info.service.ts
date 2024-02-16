import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InfoEntity } from './info.entity'
import { Repository } from 'typeorm'
import { InfoDto } from './info.dto'

@Injectable()
export class InfoService {
	constructor(
		@InjectRepository(InfoEntity)
		private readonly infoRepository: Repository<InfoEntity>,
	) {}

	async get(userId: number) {
		const info = await this.infoRepository.findOneBy({ user: { id: userId } })

		if (!info) throw new NotFoundException('Заявка не найдена!')

		return info
	}

	async update(userId: number, dto: InfoDto) {
		const info = await this.infoRepository.findOneBy({ user: { id: userId } })

		if (!info) throw new NotFoundException('Заявка не найдена!')

		info.name = dto.name
		info.surname = dto.surname
		info.country = dto.country
		info.city = dto.city
		info.street = dto.street
		info.building = dto.building
		info.apartment = dto.apartment
		info.number = dto.number

		return await this.infoRepository.save(info)
	}
}
