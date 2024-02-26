import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { AuthDto, AuthResponseDto } from './auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { BasketEntity } from '../basket/basket.entity'
import { InfoEntity } from '../info/info.entity'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(BasketEntity)
		private readonly basketRepository: Repository<BasketEntity>,
		@InjectRepository(InfoEntity)
		private readonly infoRepository: Repository<InfoEntity>,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: AuthDto): Promise<AuthResponseDto> {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id, user.email, user.role),
		}
	}

	async register(dto: AuthDto): Promise<AuthResponseDto> {
		const candidate = await this.userRepository.findOne({
			where: { email: dto.email },
		})

		if (candidate)
			throw new BadRequestException('Данный email уже зарегистрирован!')

		const salt = await genSalt(10)

		const createdUser = this.userRepository.create({
			email: dto.email,
			password: await hash(dto.password, salt),
		})
		const user = await this.userRepository.save(createdUser)

		const basket = this.basketRepository.create({ user: user })
		await this.basketRepository.save(basket)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id, user.email, user.role),
		}
	}

	async check(user: UserEntity) {
		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id, user.email, user.role),
		}
	}

	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email,
			},
			select: [
				'id',
				'email',
				'password',
				'role',
				'name',
				'surname',
				'country',
				'city',
				'street',
				'building',
				'apartment',
				'number',
			],
		})

		if (!user) throw new NotFoundException('Не верный email или пароль!')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword)
			throw new UnauthorizedException('Не верный email или пароль!')

		return user
	}

	async issueAccessToken(userId: number, email: string, role: string) {
		const data = {
			id: userId,
			email: email,
			role: role,
		}

		return await this.jwtService.signAsync(data, {
			expiresIn: '24h',
		})
	}

	returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email,
			role: user.role,
			name: user.name,
			surname: user.surname,
			country: user.country,
			city: user.city,
			street: user.street,
			building: user.building,
			apartment: user.apartment,
			number: user.number,
		}
	}
}
