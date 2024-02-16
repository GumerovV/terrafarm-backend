import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { UserEntity } from '../../user/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		})
	}

	async validate({ id }: Pick<UserEntity, 'id'>) {
		return await this.userRepository.findBy({ id })
	}
}
