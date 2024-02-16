import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.stategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../../config/jwt.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { BasketEntity } from '../basket/basket.entity'

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		TypeOrmModule.forFeature([UserEntity, BasketEntity]),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
